"""Bookings App — URLs"""
from django.urls import path
from .views import PassengerBookingListCreateView, ConductorTripListView, ConductorBookingListView, conductor_verify_payment

urlpatterns = [
    path('', PassengerBookingListCreateView.as_view(), name='passenger-bookings'),
    path('conductor/trips/', ConductorTripListView.as_view(), name='conductor-trips'),
    path('conductor/trips/<int:pk>/bookings/', ConductorBookingListView.as_view(), name='conductor-trip-bookings'),
    path('verify-payment/<int:booking_id>/', conductor_verify_payment, name='verify-payment'),
]