"""Routes App — Placeholder URLs"""
from django.urls import path
from .views import RoutePlaceholderView
urlpatterns = [path('', RoutePlaceholderView.as_view(), name='routes-placeholder')]
