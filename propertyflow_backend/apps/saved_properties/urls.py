from django.urls import path

from apps.saved_properties.views import MySavedPropertiesView


urlpatterns = [
    path("users/me/saved-properties/", MySavedPropertiesView.as_view(), name="my-saved-properties"),
]
