from rest_framework import serializers

from apps.properties.serializers import PropertyListSerializer
from apps.saved_properties.models import SavedProperty


class SavedPropertySerializer(serializers.ModelSerializer):
    saved_at = serializers.DateTimeField(source="created_at", read_only=True)
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = SavedProperty
        fields = ("id", "property", "saved_at")
