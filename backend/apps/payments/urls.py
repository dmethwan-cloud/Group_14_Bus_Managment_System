"""Payments App — Placeholder URLs"""
from django.urls import path
from .views import PaymentPlaceholderView
urlpatterns = [path('', PaymentPlaceholderView.as_view(), name='payments-placeholder')]
