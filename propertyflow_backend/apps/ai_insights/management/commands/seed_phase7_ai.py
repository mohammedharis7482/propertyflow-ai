from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.ai_insights.models import AIInsight
from apps.ai_insights.services import (
    generate_lead_priority,
    generate_listing_quality,
    generate_market_signal_summary,
    generate_property_match_score,
    generate_user_recommendations,
)
from apps.inquiries.models import Inquiry
from apps.properties.models import Property


class Command(BaseCommand):
    help = "Generate rule-based AI insight seed data for Phase 7A."

    def handle(self, *args, **options):
        users = User.objects.filter(role=User.Role.USER, is_active=True)[:8]
        properties = Property.objects.select_related("agent__user").prefetch_related("images", "features")
        inquiries = Inquiry.objects.select_related("user", "property", "agent__user")

        for user in users:
            for recommendation in generate_user_recommendations(user)[:3]:
                property_obj = recommendation["property"]
                AIInsight.objects.update_or_create(
                    user=user,
                    property=property_obj,
                    inquiry=None,
                    insight_type=AIInsight.InsightType.PROPERTY_RECOMMENDATION,
                    defaults={
                        "score": recommendation["match_score"],
                        "title": f"Recommended: {property_obj.title}",
                        "summary": recommendation["reason"],
                        "metadata": {"property_slug": property_obj.slug},
                    },
                )

            for property_obj in properties[:5]:
                match = generate_property_match_score(user, property_obj)
                AIInsight.objects.update_or_create(
                    user=user,
                    property=property_obj,
                    inquiry=None,
                    insight_type=AIInsight.InsightType.MATCH_SCORE,
                    defaults={
                        "score": match["score"],
                        "title": f"Match score for {property_obj.title}",
                        "summary": match["summary"],
                        "metadata": {"reasons": match.get("reasons", [])},
                    },
                )

        for property_obj in properties:
            quality = generate_listing_quality(property_obj)
            AIInsight.objects.update_or_create(
                user=property_obj.agent.user,
                property=property_obj,
                inquiry=None,
                insight_type=AIInsight.InsightType.LISTING_QUALITY,
                defaults={
                    "score": quality["score"],
                    "title": f"Listing quality: {property_obj.title}",
                    "summary": quality["summary"],
                    "metadata": {"suggestions": quality["suggestions"]},
                },
            )

        for inquiry in inquiries:
            priority = generate_lead_priority(inquiry)
            AIInsight.objects.update_or_create(
                user=inquiry.agent.user,
                property=inquiry.property,
                inquiry=inquiry,
                insight_type=AIInsight.InsightType.LEAD_PRIORITY,
                defaults={
                    "score": priority["score"],
                    "title": f"Lead priority: {inquiry.full_name}",
                    "summary": priority["summary"],
                    "metadata": {"priority": priority["priority"]},
                },
            )

        market = generate_market_signal_summary()
        AIInsight.objects.update_or_create(
            user=None,
            property=None,
            inquiry=None,
            insight_type=AIInsight.InsightType.MARKET_SIGNAL,
            defaults={
                "score": 80 if market["inquiry_counts"] else 50,
                "title": "Market signal summary",
                "summary": market["demand_summary"],
                "metadata": market,
            },
        )

        self.stdout.write(self.style.SUCCESS("Phase 7 AI seed data completed."))
