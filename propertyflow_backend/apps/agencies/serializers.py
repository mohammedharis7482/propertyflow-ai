from rest_framework import serializers

from apps.agencies.models import Agency


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = (
            "id",
            "name",
            "slug",
            "logo",
            "email",
            "phone",
            "website",
            "address",
            "city",
            "country",
            "description",
            "is_verified",
            "created_at",
            "updated_at",
        )
