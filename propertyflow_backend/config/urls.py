from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/agencies/", include("apps.agencies.urls")),
    path("api/v1/agents/", include("apps.agents.urls")),
    path("api/v1/properties/", include("apps.properties.urls")),
    path("api/v1/ai/", include("apps.ai_insights.urls")),
    path("api/v1/admin/", include("apps.admin_panel.urls")),
    path("api/v1/", include("apps.saved_properties.urls")),
    path("api/v1/", include("apps.inquiries.urls")),
    path("api/v1/", include("apps.appointments.urls")),
    path("api/v1/", include("apps.notifications.urls")),
    path("api/v1/", include("apps.core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
