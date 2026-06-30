from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from datetime import time, timedelta

from apps.agencies.models import Agency
from apps.agents.models import AgentProfile
from apps.appointments.models import Appointment
from apps.audit_logs.models import AuditLog
from apps.inquiries.models import Inquiry
from apps.notifications.models import Notification
from apps.properties.models import Property


User = get_user_model()


class Command(BaseCommand):
    help = "Seed Phase 4 admin control data."

    def handle(self, *args, **options):
        admin = self.ensure_admin()
        agent, profile = self.ensure_test_agent()
        self.prepare_pending_agents()
        self.prepare_pending_properties()
        self.ensure_agent_workflow(agent, profile)
        self.prepare_admin_notification(admin)
        self.prepare_audit_logs(admin)
        self.stdout.write(self.style.SUCCESS("Phase 4 seed data completed."))

    def ensure_admin(self):
        admin, _ = User.objects.update_or_create(
            email="admin@propertyflow.ai",
            defaults={
                "full_name": "PropertyFlow Admin",
                "phone": "+971500009999",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "is_verified": True,
            },
        )
        admin.set_password("Admin@12345")
        admin.save()
        return admin

    def ensure_test_agent(self):
        agency, _ = Agency.objects.update_or_create(
            slug="propertyflow-premier-realty",
            defaults={
                "name": "PropertyFlow Premier Realty",
                "email": "premier@propertyflow.ai",
                "phone": "+971500001234",
                "website": "https://propertyflow.ai",
                "address": "Dubai Marina, Dubai",
                "city": "Dubai",
                "country": "United Arab Emirates",
                "description": "Premium GCC real estate advisory agency for dashboard testing.",
                "is_verified": True,
            },
        )
        agent, _ = User.objects.update_or_create(
            email="agent@propertyflow.ai",
            defaults={
                "full_name": "PropertyFlow Test Agent",
                "phone": "+971500001111",
                "role": User.Role.AGENT,
                "is_staff": False,
                "is_superuser": False,
                "is_active": True,
                "is_verified": True,
            },
        )
        agent.set_password("Agent@12345")
        agent.save()

        profile, _ = AgentProfile.objects.update_or_create(
            user=agent,
            defaults={
                "agency": agency,
                "slug": "propertyflow-test-agent",
                "license_number": "PF-AGENT-0001",
                "bio": "Verified test agent for PropertyFlow AI dashboard QA.",
                "experience_years": 9,
                "languages": "English, Arabic, Hindi",
                "service_areas": "Dubai Marina, Palm Jumeirah, Downtown Dubai",
                "specialization": "Luxury apartments and waterfront villas",
                "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
                "rating": "4.90",
                "total_reviews": 128,
                "total_sales": 64,
                "verification_status": AgentProfile.VerificationStatus.VERIFIED,
                "is_featured": True,
            },
        )
        return agent, profile

    def prepare_pending_agents(self):
        for agent in AgentProfile.objects.select_related("user").exclude(user__email="agent@propertyflow.ai").order_by("id")[:2]:
            agent.verification_status = AgentProfile.VerificationStatus.PENDING
            agent.user.is_verified = False
            agent.save(update_fields=["verification_status", "updated_at"])
            agent.user.save(update_fields=["is_verified", "updated_at"])

    def prepare_pending_properties(self):
        properties = list(Property.objects.exclude(agent__user__email="agent@propertyflow.ai").order_by("id")[:4])
        for index, prop in enumerate(properties):
            prop.approval_status = (
                Property.ApprovalStatus.PENDING
                if index < 3
                else Property.ApprovalStatus.REJECTED
            )
            prop.save(update_fields=["approval_status", "updated_at"])

    def ensure_agent_workflow(self, agent, profile):
        properties = self.ensure_agent_properties(profile)
        user = self.ensure_test_user()
        inquiries = self.ensure_agent_inquiries(user, profile, properties)
        self.ensure_agent_appointments(user, profile, properties, inquiries)
        self.ensure_agent_notifications(agent)

    def ensure_agent_properties(self, profile):
        property_specs = [
            {
                "slug": "agent-test-marina-sky-residence",
                "title": "Agent Test Marina Sky Residence",
                "description": "Backend-ready premium apartment listing for agent dashboard QA.",
                "property_type": Property.PropertyType.APARTMENT,
                "purpose": Property.Purpose.SALE,
                "price": "2850000.00",
                "currency": "AED",
                "country": "United Arab Emirates",
                "city": "Dubai",
                "area": "Dubai Marina",
                "address": "Dubai Marina Walk",
                "bedrooms": 2,
                "bathrooms": 3,
                "parking_spaces": 1,
                "size_sqft": 1480,
                "furnishing_status": Property.FurnishingStatus.FULLY_FURNISHED,
                "views_count": 1240,
            },
            {
                "slug": "agent-test-palm-signature-villa",
                "title": "Agent Test Palm Signature Villa",
                "description": "Verified waterfront villa listing for testing agent dashboard listings and leads.",
                "property_type": Property.PropertyType.VILLA,
                "purpose": Property.Purpose.SALE,
                "price": "18500000.00",
                "currency": "AED",
                "country": "United Arab Emirates",
                "city": "Dubai",
                "area": "Palm Jumeirah",
                "address": "Palm Jumeirah Frond",
                "bedrooms": 5,
                "bathrooms": 6,
                "parking_spaces": 3,
                "size_sqft": 7200,
                "furnishing_status": Property.FurnishingStatus.SEMI_FURNISHED,
                "views_count": 1820,
            },
            {
                "slug": "agent-test-downtown-skyline-apartment",
                "title": "Agent Test Downtown Skyline Apartment",
                "description": "High-demand downtown listing for live agent dashboard data.",
                "property_type": Property.PropertyType.APARTMENT,
                "purpose": Property.Purpose.RENT,
                "price": "240000.00",
                "currency": "AED",
                "country": "United Arab Emirates",
                "city": "Dubai",
                "area": "Downtown Dubai",
                "address": "Boulevard Crescent",
                "bedrooms": 3,
                "bathrooms": 4,
                "parking_spaces": 2,
                "size_sqft": 2100,
                "furnishing_status": Property.FurnishingStatus.FULLY_FURNISHED,
                "views_count": 980,
            },
        ]
        properties = []
        for spec in property_specs:
            prop, _ = Property.objects.update_or_create(
                slug=spec["slug"],
                defaults={
                    **spec,
                    "agent": profile,
                    "status": Property.Status.PUBLISHED,
                    "approval_status": Property.ApprovalStatus.APPROVED,
                    "is_featured": True,
                },
            )
            properties.append(prop)
        return properties

    def ensure_test_user(self):
        user, _ = User.objects.update_or_create(
            email="agent.lead@propertyflow.ai",
            defaults={
                "full_name": "Agent Lead Test User",
                "phone": "+971500002222",
                "role": User.Role.USER,
                "is_active": True,
                "is_verified": True,
            },
        )
        user.set_password("User@12345")
        user.save()
        return user

    def ensure_agent_inquiries(self, user, profile, properties):
        inquiries = []
        statuses = [Inquiry.Status.NEW, Inquiry.Status.CONTACTED, Inquiry.Status.QUALIFIED]
        priorities = [Inquiry.Priority.HIGH, Inquiry.Priority.MEDIUM, Inquiry.Priority.HIGH]
        for index, prop in enumerate(properties):
            inquiry, _ = Inquiry.objects.update_or_create(
                user=user,
                property=prop,
                message=f"I am interested in {prop.title} and would like to schedule a viewing.",
                defaults={
                    "agent": profile,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "status": statuses[index % len(statuses)],
                    "priority": priorities[index % len(priorities)],
                    "source": Inquiry.Source.PROPERTY_DETAIL,
                },
            )
            inquiries.append(inquiry)
        return inquiries

    def ensure_agent_appointments(self, user, profile, properties, inquiries):
        start_date = timezone.localdate() + timedelta(days=3)
        for index, prop in enumerate(properties[:2]):
            Appointment.objects.update_or_create(
                user=user,
                property=prop,
                appointment_date=start_date + timedelta(days=index),
                appointment_time=time(hour=10 + index, minute=30),
                defaults={
                    "agent": profile,
                    "inquiry": inquiries[index] if index < len(inquiries) else None,
                    "status": Appointment.Status.PENDING if index == 0 else Appointment.Status.CONFIRMED,
                    "visit_type": Appointment.VisitType.IN_PERSON if index == 0 else Appointment.VisitType.VIRTUAL,
                    "notes": "Guaranteed seeded appointment for agent dashboard QA.",
                },
            )

    def ensure_agent_notifications(self, agent):
        Notification.objects.update_or_create(
            user=agent,
            title="Agent dashboard ready",
            defaults={
                "message": "Your verified agent profile, listings, leads, and appointments are ready.",
                "notification_type": Notification.NotificationType.ACCOUNT,
                "is_read": False,
            },
        )

    def prepare_admin_notification(self, admin):
        Notification.objects.update_or_create(
            user=admin,
            title="Admin control center ready",
            defaults={
                "message": "Phase 4 admin APIs are ready for verification.",
                "notification_type": Notification.NotificationType.SYSTEM,
                "is_read": False,
            },
        )

    def prepare_audit_logs(self, admin):
        AuditLog.objects.update_or_create(
            actor=admin,
            action="ADMIN_PHASE4_SEEDED",
            target_type="System",
            target_id="phase4",
            defaults={
                "description": "Prepared admin-facing Phase 4 seed data.",
                "metadata": {"phase": 4},
            },
        )
