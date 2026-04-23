"""Tickets App — Placeholder URLs"""
from django.urls import path
from .views import TicketPlaceholderView
urlpatterns = [path('', TicketPlaceholderView.as_view(), name='tickets-placeholder')]
