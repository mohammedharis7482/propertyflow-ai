from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.agencies.models import Agency
from apps.agents.models import AgentProfile
from apps.properties.models import Property, PropertyFeature, PropertyImage


User = get_user_model()


FEATURES = [
    ("Swimming Pool", "waves"),
    ("Gym", "dumbbell"),
    ("Sea View", "water"),
    ("Parking", "car"),
    ("Smart Home", "house-wifi"),
    ("Security", "shield-check"),
    ("Balcony", "building"),
    ("Maid Room", "door-open"),
    ("Beach Access", "umbrella"),
    ("Metro Nearby", "train"),
    ("Concierge", "bell"),
    ("Private Garden", "trees"),
]

AGENCIES = [
    {
        "name": "Altius Gulf Estates",
        "email": "hello@altiusgulf.example",
        "phone": "+971 4 555 0101",
        "website": "https://example.com/altius-gulf",
        "address": "Emaar Square, Downtown Dubai",
        "city": "Dubai",
        "country": "United Arab Emirates",
        "description": "Premium GCC brokerage focused on luxury waterfront homes, branded residences, and investor-grade assets.",
    },
    {
        "name": "Pearl Horizon Realty",
        "email": "advisors@pearlhorizon.example",
        "phone": "+974 4400 2200",
        "website": "https://example.com/pearl-horizon",
        "address": "Porto Arabia, The Pearl",
        "city": "Doha",
        "country": "Qatar",
        "description": "Qatar-based advisory firm specializing in The Pearl, Lusail, and waterfront investment opportunities.",
    },
    {
        "name": "Najd Signature Properties",
        "email": "contact@najdsignature.example",
        "phone": "+966 11 555 8080",
        "website": "https://example.com/najd-signature",
        "address": "King Fahd Road",
        "city": "Riyadh",
        "country": "Saudi Arabia",
        "description": "Saudi premium real estate advisory serving Riyadh, Jeddah, and high-growth lifestyle communities.",
    },
    {
        "name": "Corniche Prime Realty",
        "email": "prime@cornicherealty.example",
        "phone": "+971 2 555 3300",
        "website": "https://example.com/corniche-prime",
        "address": "Corniche Road",
        "city": "Abu Dhabi",
        "country": "United Arab Emirates",
        "description": "Abu Dhabi luxury brokerage focused on waterfront residences, villas, and institutional-grade assets.",
    },
]

AGENTS = [
    {
        "full_name": "Ahmed Al Mansoori",
        "email": "ahmed.mansoori@propertyflow.example",
        "phone": "+971500000101",
        "agency": "Altius Gulf Estates",
        "license_number": "DLD-AG-1001",
        "bio": "Luxury Dubai advisor with deep expertise in Palm Jumeirah, Dubai Marina, and branded residences.",
        "experience_years": 11,
        "languages": "Arabic, English",
        "service_areas": "Palm Jumeirah, Dubai Marina, Downtown Dubai",
        "specialization": "Luxury villas and waterfront apartments",
        "rating": "4.92",
        "total_reviews": 128,
        "total_sales": 86,
        "is_featured": True,
        "profile_image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Noura Al Fahim",
        "email": "noura.fahim@propertyflow.example",
        "phone": "+971500000102",
        "agency": "Altius Gulf Estates",
        "license_number": "DLD-AG-1002",
        "bio": "Investor-focused advisor for Dubai Marina, Business Bay, and premium rental yield assets.",
        "experience_years": 8,
        "languages": "Arabic, English, French",
        "service_areas": "Dubai Marina, Business Bay, Jumeirah Beach Residence",
        "specialization": "Investment apartments and executive offices",
        "rating": "4.84",
        "total_reviews": 96,
        "total_sales": 64,
        "is_featured": True,
        "profile_image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Layla Mohammed",
        "email": "layla.mohammed@propertyflow.example",
        "phone": "+971500000103",
        "agency": "Corniche Prime Realty",
        "license_number": "ADM-CP-2001",
        "bio": "Family villa specialist across Abu Dhabi Corniche, Saadiyat, and premium UAE communities.",
        "experience_years": 10,
        "languages": "Arabic, English",
        "service_areas": "Abu Dhabi Corniche, Saadiyat Island, Yas Island",
        "specialization": "Family villas and waterfront homes",
        "rating": "4.88",
        "total_reviews": 111,
        "total_sales": 72,
        "is_featured": False,
        "profile_image_url": "https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Omar Al Thani",
        "email": "omar.thani@propertyflow.example",
        "phone": "+97450000101",
        "agency": "Pearl Horizon Realty",
        "license_number": "QAR-PH-3001",
        "bio": "Qatar waterfront property advisor focused on The Pearl, Lusail, and premium rental investments.",
        "experience_years": 9,
        "languages": "Arabic, English",
        "service_areas": "The Pearl Qatar, Lusail, West Bay",
        "specialization": "Sea-view apartments and penthouses",
        "rating": "4.91",
        "total_reviews": 104,
        "total_sales": 67,
        "is_featured": True,
        "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Sara Al Kuwari",
        "email": "sara.kuwari@propertyflow.example",
        "phone": "+97450000102",
        "agency": "Pearl Horizon Realty",
        "license_number": "QAR-PH-3002",
        "bio": "Lusail and Doha advisor with a strong record in waterfront apartments and investor portfolios.",
        "experience_years": 7,
        "languages": "Arabic, English, Spanish",
        "service_areas": "Lusail, The Pearl Qatar, Doha West Bay",
        "specialization": "Waterfront apartments and buy-to-let assets",
        "rating": "4.79",
        "total_reviews": 78,
        "total_sales": 49,
        "is_featured": False,
        "profile_image_url": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Faisal Al Saud",
        "email": "faisal.saud@propertyflow.example",
        "phone": "+96650000101",
        "agency": "Najd Signature Properties",
        "license_number": "KSA-NS-4001",
        "bio": "Riyadh prime property advisor focused on business districts, executive residences, and family compounds.",
        "experience_years": 12,
        "languages": "Arabic, English",
        "service_areas": "Riyadh, King Abdullah Financial District, Diriyah",
        "specialization": "Executive residences and prime commercial assets",
        "rating": "4.87",
        "total_reviews": 118,
        "total_sales": 83,
        "is_featured": True,
        "profile_image_url": "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Maha Al Harbi",
        "email": "maha.harbi@propertyflow.example",
        "phone": "+96650000102",
        "agency": "Najd Signature Properties",
        "license_number": "KSA-NS-4002",
        "bio": "Jeddah waterfront specialist helping families and investors secure high-quality coastal properties.",
        "experience_years": 8,
        "languages": "Arabic, English",
        "service_areas": "Jeddah Waterfront, Al Hamra, Obhur",
        "specialization": "Waterfront apartments and coastal villas",
        "rating": "4.81",
        "total_reviews": 89,
        "total_sales": 57,
        "is_featured": False,
        "profile_image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
    {
        "full_name": "Khalid Al Nuaimi",
        "email": "khalid.nuaimi@propertyflow.example",
        "phone": "+971500000104",
        "agency": "Corniche Prime Realty",
        "license_number": "ADM-CP-2002",
        "bio": "Abu Dhabi premium advisor for Corniche residences, investment apartments, and waterfront homes.",
        "experience_years": 9,
        "languages": "Arabic, English, Hindi",
        "service_areas": "Abu Dhabi Corniche, Al Reem Island, Al Maryah Island",
        "specialization": "Waterfront residences and investment apartments",
        "rating": "4.83",
        "total_reviews": 92,
        "total_sales": 61,
        "is_featured": False,
        "profile_image_url": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
    },
]

PROPERTY_IMAGES = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
]

PROPERTIES = [
    ("Luxury Marina View Apartment", "Dubai Marina", "Dubai", "United Arab Emirates", "AED", "APARTMENT", "SALE", 2850000, 2, 3, 1450, "Noura Al Fahim", True),
    ("Palm Jumeirah Signature Villa", "Palm Jumeirah", "Dubai", "United Arab Emirates", "AED", "VILLA", "SALE", 18500000, 5, 6, 7200, "Ahmed Al Mansoori", True),
    ("Downtown Dubai Skyline Residence", "Downtown Dubai", "Dubai", "United Arab Emirates", "AED", "APARTMENT", "SALE", 4200000, 3, 4, 2100, "Ahmed Al Mansoori", True),
    ("Business Bay Executive Office", "Business Bay", "Dubai", "United Arab Emirates", "AED", "OFFICE", "RENT", 420000, 0, 2, 1800, "Noura Al Fahim", False),
    ("Lusail Waterfront Apartment", "Lusail Marina", "Lusail", "Qatar", "QAR", "APARTMENT", "SALE", 2400000, 2, 3, 1550, "Sara Al Kuwari", True),
    ("The Pearl Qatar Sea View Penthouse", "The Pearl Qatar", "Doha", "Qatar", "QAR", "PENTHOUSE", "SALE", 9200000, 4, 5, 4100, "Omar Al Thani", True),
    ("West Bay Premium Apartment", "West Bay", "Doha", "Qatar", "QAR", "APARTMENT", "RENT", 18000, 2, 3, 1650, "Omar Al Thani", False),
    ("Riyadh Executive Residence", "King Abdullah Financial District", "Riyadh", "Saudi Arabia", "SAR", "APARTMENT", "SALE", 3200000, 3, 4, 2300, "Faisal Al Saud", True),
    ("Diriyah Family Townhouse", "Diriyah", "Riyadh", "Saudi Arabia", "SAR", "TOWNHOUSE", "SALE", 5800000, 4, 5, 3600, "Faisal Al Saud", False),
    ("Jeddah Waterfront Apartment", "Jeddah Waterfront", "Jeddah", "Saudi Arabia", "SAR", "APARTMENT", "SALE", 2750000, 3, 3, 2100, "Maha Al Harbi", True),
    ("Abu Dhabi Corniche Residence", "Corniche", "Abu Dhabi", "United Arab Emirates", "AED", "APARTMENT", "SALE", 3900000, 3, 4, 2400, "Khalid Al Nuaimi", True),
    ("Saadiyat Island Garden Villa", "Saadiyat Island", "Abu Dhabi", "United Arab Emirates", "AED", "VILLA", "SALE", 14500000, 5, 6, 6800, "Layla Mohammed", True),
    ("Al Reem Island Smart Apartment", "Al Reem Island", "Abu Dhabi", "United Arab Emirates", "AED", "APARTMENT", "RENT", 185000, 2, 2, 1300, "Khalid Al Nuaimi", False),
    ("Dubai Hills Family Villa", "Dubai Hills Estate", "Dubai", "United Arab Emirates", "AED", "VILLA", "SALE", 7200000, 4, 5, 4800, "Ahmed Al Mansoori", False),
    ("Marina Sky Serviced Residence", "Dubai Marina", "Dubai", "United Arab Emirates", "AED", "APARTMENT", "RENT", 260000, 2, 3, 1500, "Noura Al Fahim", False),
    ("Lusail Boulevard Retail Space", "Lusail Boulevard", "Lusail", "Qatar", "QAR", "RETAIL", "RENT", 32000, 0, 1, 1200, "Sara Al Kuwari", False),
    ("Obhur Coastal Villa", "Obhur", "Jeddah", "Saudi Arabia", "SAR", "VILLA", "SALE", 6900000, 5, 6, 5400, "Maha Al Harbi", False),
    ("Al Maryah Executive Office", "Al Maryah Island", "Abu Dhabi", "United Arab Emirates", "AED", "OFFICE", "RENT", 560000, 0, 2, 2200, "Khalid Al Nuaimi", False),
]


class Command(BaseCommand):
    help = "Seed Phase 2 public real estate data."

    def handle(self, *args, **options):
        features = self.seed_features()
        agencies = self.seed_agencies()
        agents = self.seed_agents(agencies)
        self.seed_properties(features, agents)
        self.stdout.write(self.style.SUCCESS("Phase 2 seed data completed."))

    def seed_features(self):
        feature_map = {}
        for name, icon in FEATURES:
            feature, _ = PropertyFeature.objects.update_or_create(
                slug=slugify(name),
                defaults={"name": name, "icon": icon},
            )
            feature_map[name] = feature
        return feature_map

    def seed_agencies(self):
        agency_map = {}
        for item in AGENCIES:
            agency, _ = Agency.objects.update_or_create(
                slug=slugify(item["name"]),
                defaults={**item, "is_verified": True},
            )
            agency_map[item["name"]] = agency
        return agency_map

    def seed_agents(self, agencies):
        agent_map = {}
        for item in AGENTS:
            user, _ = User.objects.update_or_create(
                email=item["email"],
                defaults={
                    "full_name": item["full_name"],
                    "phone": item["phone"],
                    "role": User.Role.AGENT,
                    "is_active": True,
                    "is_verified": True,
                },
            )
            user.set_password("AgentPassword123")
            user.save(update_fields=["password"])

            profile, _ = AgentProfile.objects.update_or_create(
                user=user,
                defaults={
                    "agency": agencies[item["agency"]],
                    "slug": slugify(item["full_name"]),
                    "license_number": item["license_number"],
                    "bio": item["bio"],
                    "experience_years": item["experience_years"],
                    "languages": item["languages"],
                    "service_areas": item["service_areas"],
                    "specialization": item["specialization"],
                    "profile_image_url": item["profile_image_url"],
                    "rating": Decimal(item["rating"]),
                    "total_reviews": item["total_reviews"],
                    "total_sales": item["total_sales"],
                    "verification_status": AgentProfile.VerificationStatus.VERIFIED,
                    "is_featured": item["is_featured"],
                },
            )
            agent_map[item["full_name"]] = profile
        return agent_map

    def seed_properties(self, features, agents):
        feature_values = list(features.values())
        for index, item in enumerate(PROPERTIES):
            (
                title,
                area,
                city,
                country,
                currency,
                property_type,
                purpose,
                price,
                bedrooms,
                bathrooms,
                size_sqft,
                agent_name,
                is_featured,
            ) = item

            property_obj, _ = Property.objects.update_or_create(
                slug=slugify(title),
                defaults={
                    "agent": agents[agent_name],
                    "title": title,
                    "description": (
                        f"{title} offers a premium {area} address with curated finishes, "
                        "strong lifestyle appeal, and resilient long-term demand signals."
                    ),
                    "property_type": property_type,
                    "purpose": purpose,
                    "price": Decimal(price),
                    "currency": currency,
                    "country": country,
                    "city": city,
                    "area": area,
                    "address": f"{area}, {city}",
                    "latitude": Decimal("25.204849") if country != "Saudi Arabia" else Decimal("24.713552"),
                    "longitude": Decimal("55.270783") if country != "Saudi Arabia" else Decimal("46.675297"),
                    "bedrooms": bedrooms,
                    "bathrooms": bathrooms,
                    "parking_spaces": 2 if bedrooms else 1,
                    "size_sqft": size_sqft,
                    "furnishing_status": Property.FurnishingStatus.FULLY_FURNISHED,
                    "status": Property.Status.PUBLISHED,
                    "approval_status": Property.ApprovalStatus.APPROVED,
                    "is_featured": is_featured,
                    "views_count": 820 + index * 143,
                },
            )

            selected_features = feature_values[index % 6 : index % 6 + 6]
            if len(selected_features) < 4:
                selected_features = feature_values[:6]
            property_obj.features.set(selected_features)

            for image_index in range(3):
                image_url = PROPERTY_IMAGES[(index + image_index) % len(PROPERTY_IMAGES)]
                PropertyImage.objects.update_or_create(
                    property=property_obj,
                    order=image_index,
                    defaults={
                        "image_url": image_url,
                        "alt_text": f"{title} image {image_index + 1}",
                        "is_primary": image_index == 0,
                    },
                )
