"""
Buses App — Bus and BusAssignment Models

Bus: registered by operators (number, name, seats, AC type)
BusAssignment: operator assigns a bus to a route+schedule; admin must approve.
Editing an assignment resets status to 'pending' for re-approval.
"""

from django.db import models
from django.conf import settings
from apps.routes.models import Route


class Bus(models.Model):
    bus_number = models.CharField(max_length=20, unique=True)
    bus_name = models.CharField(max_length=100, unique=True)
    num_seats = models.PositiveIntegerField()
    is_ac = models.BooleanField(default=False)  # True = AC, False = Non-AC
    operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='buses',
        limit_choices_to={'role': 'operator'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Bus'
        verbose_name_plural = 'Buses'
        ordering = ['bus_number']

    def __str__(self):
        return f"{self.bus_number} — {self.bus_name}"


class BusAssignment(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='assignments')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='assignments')
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Track who reviewed it
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviewed_assignments'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Bus Assignment'
        verbose_name_plural = 'Bus Assignments'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.bus} on {self.route} ({self.date}) — {self.status}"
