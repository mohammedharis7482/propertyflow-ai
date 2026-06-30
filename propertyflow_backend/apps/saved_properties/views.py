from rest_framework import permissions, response, views

from apps.saved_properties.models import SavedProperty
from apps.saved_properties.serializers import SavedPropertySerializer


class MySavedPropertiesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = (
            SavedProperty.objects.select_related("property__agent__user", "property__agent__agency")
            .prefetch_related("property__images")
            .filter(user=request.user)
            .order_by("-created_at")
        )
        serializer = SavedPropertySerializer(
            queryset,
            many=True,
            context={"request": request},
        )
        return response.Response(serializer.data)
