from datetime import date, time, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.appointments.models import Appointment
from apps.inquiries.models import Inquiry
from apps.notifications.models import Notification
from apps.properties.models import Property
from apps.saved_properties.models import SavedProperty


User = get_user_model()

USERS = [
    ("Aisha Khan", "aisha.khan@propertyflow.example", "+971501110001"),
    ("Rohan Menon", "rohan.menon@propertyflow.example", "+971501110002"),
    ("Fatima Al Nuaimi", "fatima.nuaimi@propertyflow.example", "+971501110003"),
    ("Khalid Hassan", "khalid.hassan@propertyflow.example", "+974501110004"),
    ("Priya Sharma", "priya.sharma@propertyflow.example", "+966501110005"),
]

MESSAGES = [
    "I am interested in this property and would like to know the payment plan.",
    "Please share more details about service charges and viewing availability.",
    "I am comparing premium options and would like an agent callback.",
    "Can you confirm whether this property is available for immediate move-in?",
    "I would like investment yield details and nearby comparable properties.",
]


class Command(BaseCommand):
    help = "Seed Phase 3 user actions and lead workflow data."

    def handle(self, *args, **options):
        users = self.seed_users()
        properties = list(
            Property.objects.select_related("agent__user")
            .filter(status=Property.Status.PUBLISHED, approval_status=Property.ApprovalStatus.APPROVED)
            .order_by("id")
        )
        if not properties:
            self.stdout.write(self.style.WARNING("No approved properties found. Run seed_phase2 first."))
            return

        self.seed_saved_properties(users, properties)
        inquiries = self.seed_inquiries(users, properties)
        self.seed_appointments(users, properties, inquiries)
        self.seed_notifications(users, inquiries)
        self.stdout.write(self.style.SUCCESS("Phase 3 seed data completed."))

    def seed_users(self):
        users = []
        for full_name, email, phone in USERS:
            user, _ = User.objects.update_or_create(
                email=email,
                defaults={
                    "full_name": full_name,
                    "phone": phone,
                    "role": User.Role.USER,
                    "is_active": True,
                    "is_verified": True,
                },
            )
            user.set_password("UserPassword123")
            user.save(update_fields=["password"])
            users.append(user)
        return users

    def seed_saved_properties(self, users, properties):
        for index in range(15):
            SavedProperty.objects.get_or_create(
                user=users[index % len(users)],
                property=properties[index % len(properties)],
            )

    def seed_inquiries(self, users, properties):
        inquiries = []
        statuses = [
            Inquiry.Status.NEW,
            Inquiry.Status.CONTACTED,
            Inquiry.Status.QUALIFIED,
            Inquiry.Status.NEGOTIATION,
        ]
        priorities = [Inquiry.Priority.MEDIUM, Inquiry.Priority.HIGH, Inquiry.Priority.LOW]
        sources = [
            Inquiry.Source.PROPERTY_DETAIL,
            Inquiry.Source.AGENT_PROFILE,
            Inquiry.Source.AI_RECOMMENDATION,
            Inquiry.Source.CONTACT_FORM,
        ]

        for index in range(12):
            user = users[index % len(users)]
            property_obj = properties[(index * 2) % len(properties)]
            inquiry, _ = Inquiry.objects.update_or_create(
                user=user,
                property=property_obj,
                message=MESSAGES[index % len(MESSAGES)],
                defaults={
                    "agent": property_obj.agent,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "status": statuses[index % len(statuses)],
                    "priority": priorities[index % len(priorities)],
                    "source": sources[index % len(sources)],
                },
            )
            inquiries.append(inquiry)
        return inquiries

    def seed_appointments(self, users, properties, inquiries):
        statuses = [
            Appointment.Status.PENDING,
            Appointment.Status.CONFIRMED,
            Appointment.Status.RESCHEDULED,
            Appointment.Status.COMPLETED,
        ]
        visit_types = [Appointment.VisitType.IN_PERSON, Appointment.VisitType.VIRTUAL]
        start_date = timezone.localdate() + timedelta(days=5)

        for index in range(8):
            user = users[index % len(users)]
            property_obj = properties[(index * 3) % len(properties)]
            inquiry = inquiries[index % len(inquiries)] if inquiries else None
            Appointment.objects.update_or_create(
                user=user,
                property=property_obj,
                appointment_date=start_date + timedelta(days=index),
                appointment_time=time(hour=10 + (index % 6), minute=30 if index % 2 else 0),
                defaults={
                    "agent": property_obj.agent,
                    "inquiry": inquiry if inquiry and inquiry.property_id == property_obj.id else None,
                    "status": statuses[index % len(statuses)],
                    "visit_type": visit_types[index % len(visit_types)],
                    "notes": "Seeded viewing request for premium property evaluation.",
                },
            )

    def seed_notifications(self, users, inquiries):
        for index, user in enumerate(users):
            Notification.objects.update_or_create(
                user=user,
                title="Welcome to PropertyFlow AI",
                defaults={
                    "message": "Your premium property workspace is ready.",
                    "notification_type": Notification.NotificationType.ACCOUNT,
                    "is_read": index % 2 == 0,
                },
            )

        for index, inquiry in enumerate(inquiries[:10]):
            Notification.objects.update_or_create(
                user=inquiry.agent.user,
                title=f"Lead from {inquiry.full_name}",
                message=f"{inquiry.full_name} asked about {inquiry.property.title}.",
                defaults={
                    "notification_type": Notification.NotificationType.INQUIRY,
                    "is_read": index % 3 == 0,
                },
            )

        for index, user in enumerate(users):
            Notification.objects.update_or_create(
                user=user,
                title="Viewing reminder",
                message="You have an upcoming property viewing request to review.",
                defaults={
                    "notification_type": Notification.NotificationType.APPOINTMENT,
                    "is_read": False,
                },
            )
