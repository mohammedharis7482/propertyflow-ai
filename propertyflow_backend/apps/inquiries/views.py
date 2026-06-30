from rest_framework import permissions, response, status, views
from rest_framework.exceptions import NotFound, PermissionDenied

from apps.inquiries.models import Inquiry
from apps.inquiries.serializers import (
    InquiryCreateSerializer,
    InquiryListSerializer,
    InquiryStatusUpdateSerializer,
)
from apps.notifications.services import create_notification


class InquiryCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = InquiryCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()

        create_notification(
            user=inquiry.agent.user,
            title="New property inquiry",
            message=f"{inquiry.full_name} asked about {inquiry.property.title}.",
            notification_type="INQUIRY",
        )

        return response.Response(
            {
                "message": "Inquiry submitted successfully",
                "inquiry": {
                    "id": inquiry.id,
                    "status": inquiry.status,
                    "priority": inquiry.priority,
                    "property": inquiry.property.title,
                    "agent": inquiry.agent.user.full_name,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class MyInquiriesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = (
            Inquiry.objects.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency")
            .prefetch_related("property__images")
            .filter(user=request.user)
        )
        serializer = InquiryListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)


class AgentInquiriesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "agent_profile"):
            raise NotFound("Agent profile not found.")

        queryset = (
            Inquiry.objects.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency")
            .prefetch_related("property__images")
            .filter(agent=request.user.agent_profile)
        )
        serializer = InquiryListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)


class InquiryStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        inquiry = Inquiry.objects.select_related("agent__user", "user", "property").filter(pk=pk).first()
        if not inquiry:
            raise NotFound("Inquiry not found.")
        if not hasattr(request.user, "agent_profile") or inquiry.agent_id != request.user.agent_profile.id:
            raise PermissionDenied("Only the assigned agent can update this inquiry.")

        serializer = InquiryStatusUpdateSerializer(inquiry, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        create_notification(
            user=inquiry.user,
            title="Inquiry status updated",
            message=f"Your inquiry for {inquiry.property.title} is now {inquiry.status}.",
            notification_type="INQUIRY",
        )

        return response.Response(InquiryListSerializer(inquiry, context={"request": request}).data)
