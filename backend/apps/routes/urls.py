"""Routes App — URLs"""

from django.urls import path
from .views import RouteListCreateView, RouteDetailView

urlpatterns = [
    path('', RouteListCreateView.as_view(), name='route-list-create'),
    path('<int:pk>/', RouteDetailView.as_view(), name='route-detail'),
]
