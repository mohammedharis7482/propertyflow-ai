from collections import Counter
from decimal import Decimal

from django.db.models import Count

from apps.appointments.models import Appointment
from apps.inquiries.models import Inquiry
from apps.properties.models import Property
from apps.saved_properties.models import SavedProperty


def clamp_score(score):
    return max(0, min(100, int(score)))


def published_properties():
    return (
        Property.objects.select_related("agent__user", "agent__agency")
        .prefetch_related("features", "images")
        .filter(
            status=Property.Status.PUBLISHED,
            approval_status=Property.ApprovalStatus.APPROVED,
        )
    )


def user_interest_properties(user):
    saved = Property.objects.filter(saved_by__user=user)
    inquired = Property.objects.filter(inquiries__user=user)
    return Property.objects.filter(id__in=(saved | inquired).values("id")).distinct()


def interest_profile(user):
    properties = list(user_interest_properties(user))
    return {
        "properties": properties,
        "cities": Counter(prop.city for prop in properties if prop.city),
        "types": Counter(prop.property_type for prop in properties if prop.property_type),
        "purposes": Counter(prop.purpose for prop in properties if prop.purpose),
        "prices": [prop.price for prop in properties if prop.price],
        "saved_ids": set(
            SavedProperty.objects.filter(user=user).values_list("property_id", flat=True)
        ),
    }


def price_is_similar(price, prices):
    if not prices:
        return False

    average = sum(prices, Decimal("0")) / len(prices)
    if average <= 0:
        return False

    lower = average * Decimal("0.70")
    upper = average * Decimal("1.35")
    return lower <= price <= upper


def generate_property_match_score(user, property_obj):
    profile = interest_profile(user)
    score = 0
    reasons = []

    if property_obj.city in profile["cities"]:
        score += 20
        reasons.append(f"matches your {property_obj.city} activity")
    if property_obj.property_type in profile["types"]:
        score += 20
        reasons.append("matches your preferred property type")
    if property_obj.purpose in profile["purposes"]:
        score += 15
        reasons.append("matches your sale/rent intent")
    if price_is_similar(property_obj.price, profile["prices"]):
        score += 15
        reasons.append("fits your observed budget range")
    if property_obj.is_featured:
        score += 10
        reasons.append("is a featured listing")
    if property_obj.agent.verification_status == property_obj.agent.VerificationStatus.VERIFIED:
        score += 10
        reasons.append("is represented by a verified agent")
    if property_obj.images.exists() and property_obj.features.exists():
        score += 10
        reasons.append("has strong media and feature completeness")

    if not profile["properties"]:
        score = 55
        reasons = ["save or inquire about properties to improve personalization"]

    score = clamp_score(score)
    summary = (
        "Strong match based on " + ", ".join(reasons[:3]) + "."
        if score >= 75
        else "Moderate match; more saved properties and inquiries will improve accuracy."
    )
    return {"score": score, "summary": summary, "reasons": reasons}


def generate_user_recommendations(user):
    profile = interest_profile(user)
    queryset = published_properties().exclude(id__in=profile["saved_ids"])

    if profile["cities"]:
        queryset = queryset.filter(city__in=list(profile["cities"].keys())) | published_properties().filter(is_featured=True)

    recommendations = []
    for property_obj in queryset.distinct()[:30]:
        match = generate_property_match_score(user, property_obj)
        recommendations.append(
            {
                "property": property_obj,
                "match_score": match["score"],
                "reason": match["summary"],
            }
        )

    return sorted(recommendations, key=lambda item: item["match_score"], reverse=True)[:6]


def generate_lead_priority(inquiry):
    score = 25
    if len(inquiry.message or "") >= 80:
        score += 25
    elif len(inquiry.message or "") >= 35:
        score += 15
    if inquiry.phone:
        score += 20
    if inquiry.property.price >= Decimal("3000000"):
        score += 15
    if inquiry.source == Inquiry.Source.PROPERTY_DETAIL:
        score += 10
    if inquiry.email:
        score += 5

    score = clamp_score(score)
    if score >= 75:
        priority = Inquiry.Priority.HIGH
    elif score >= 45:
        priority = Inquiry.Priority.MEDIUM
    else:
        priority = Inquiry.Priority.LOW

    summary = f"{priority.title()} priority lead based on contact completeness, intent strength, and listing value."
    return {"score": score, "priority": priority, "summary": summary}


def generate_listing_quality(property_obj):
    score = 0
    suggestions = []

    checks = [
        (bool(property_obj.title), 10, "Add a clear listing title"),
        (len(property_obj.description or "") >= 120, 15, "Expand the property description"),
        (property_obj.images.exists(), 15, "Add property images"),
        (property_obj.images.filter(is_primary=True).exists(), 10, "Set a primary property image"),
        (property_obj.features.exists(), 10, "Add property features"),
        (bool(property_obj.price), 10, "Add a clear price"),
        (bool(property_obj.city and property_obj.area and property_obj.address), 10, "Add detailed location data"),
        (property_obj.bedrooms > 0 and property_obj.bathrooms > 0 and property_obj.size_sqft > 0, 10, "Complete beds, baths, and size"),
        (property_obj.status == Property.Status.PUBLISHED and property_obj.approval_status == Property.ApprovalStatus.APPROVED, 10, "Publish and approve the listing"),
    ]

    for passed, points, suggestion in checks:
        if passed:
            score += points
        else:
            suggestions.append(suggestion)

    score = clamp_score(score)
    summary = (
        "Strong listing with complete media, pricing, and property details."
        if score >= 80
        else "Listing is usable but can improve with stronger media and details."
    )
    return {"score": score, "summary": summary, "suggestions": suggestions[:5]}


def generate_market_signal_summary():
    properties = Property.objects.all()
    inquiries = Inquiry.objects.all()
    appointments = Appointment.objects.all()

    top_cities = list(
        properties.values("city")
        .annotate(listing_count=Count("id"))
        .order_by("-listing_count")[:5]
    )
    popular_property_types = list(
        properties.values("property_type")
        .annotate(listing_count=Count("id"))
        .order_by("-listing_count")[:5]
    )
    demand_by_city = list(
        inquiries.values("property__city")
        .annotate(inquiry_count=Count("id"))
        .order_by("-inquiry_count")[:5]
    )

    top_city = demand_by_city[0]["property__city"] if demand_by_city else None
    demand_summary = (
        f"{top_city} shows the strongest inquiry demand across current platform activity."
        if top_city
        else "Demand signals will strengthen as users submit more inquiries."
    )

    return {
        "top_cities": top_cities,
        "popular_property_types": popular_property_types,
        "demand_signals": demand_by_city,
        "listing_counts": properties.count(),
        "inquiry_counts": inquiries.count(),
        "appointment_counts": appointments.count(),
        "demand_summary": demand_summary,
    }
