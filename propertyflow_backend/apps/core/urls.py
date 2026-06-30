from django.urls import path

from apps.core.dashboard_views import AgentDashboardView, UserDashboardView
from apps.core.views import HealthCheckView


urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("users/me/dashboard/", UserDashboardView.as_view(), name="user-dashboard"),
    path("agents/me/dashboard/", AgentDashboardView.as_view(), name="agent-dashboard"),
]
