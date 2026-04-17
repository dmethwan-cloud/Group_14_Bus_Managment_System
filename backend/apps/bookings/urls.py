"""Bookings App — Placeholder URLs"""
from django.urls import path
from .views import BookingPlaceholderView
urlpatterns = [path('', BookingPlaceholderView.as_view(), name='bookings-placeholder')]
