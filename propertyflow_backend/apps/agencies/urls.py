from rest_framework.routers import DefaultRouter

from apps.agencies.views import AgencyViewSet


router = DefaultRouter()
router.register("", AgencyViewSet, basename="agency")

urlpatterns = router.urls
