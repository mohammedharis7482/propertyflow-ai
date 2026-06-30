import django_filters

from apps.properties.models import Property


class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    city = django_filters.CharFilter(field_name="city", lookup_expr="iexact")
    area = django_filters.CharFilter(field_name="area", lookup_expr="icontains")
    country = django_filters.CharFilter(field_name="country", lookup_expr="iexact")

    class Meta:
        model = Property
        fields = (
            "city",
            "area",
            "country",
            "property_type",
            "purpose",
            "bedrooms",
            "bathrooms",
            "is_featured",
        )
