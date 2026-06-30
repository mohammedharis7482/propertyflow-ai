import django_filters

from apps.agents.models import AgentProfile


class AgentProfileFilter(django_filters.FilterSet):
    agency = django_filters.CharFilter(field_name="agency__slug")
    city = django_filters.CharFilter(field_name="agency__city", lookup_expr="iexact")

    class Meta:
        model = AgentProfile
        fields = (
            "agency",
            "city",
            "is_featured",
            "verification_status",
        )
