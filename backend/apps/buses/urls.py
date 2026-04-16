"""Buses App — Placeholder URLs"""
from django.urls import path
from .views import BusPlaceholderView

urlpatterns = [
    path('', BusPlaceholderView.as_view(), name='buses-placeholder'),
]
