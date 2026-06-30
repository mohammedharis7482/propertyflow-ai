from django.urls import path

from apps.inquiries.views import (
    AgentInquiriesView,
    InquiryCreateView,
    InquiryStatusUpdateView,
    MyInquiriesView,
)


urlpatterns = [
    path("inquiries/", InquiryCreateView.as_view(), name="inquiry-create"),
    path("inquiries/<int:pk>/status/", InquiryStatusUpdateView.as_view(), name="inquiry-status"),
    path("users/me/inquiries/", MyInquiriesView.as_view(), name="my-inquiries"),
    path("agents/me/inquiries/", AgentInquiriesView.as_view(), name="agent-inquiries"),
]
