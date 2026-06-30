from rest_framework.routers import DefaultRouter

from apps.agents.views import AgentProfileViewSet


router = DefaultRouter()
router.register("", AgentProfileViewSet, basename="agent")

urlpatterns = router.urls
