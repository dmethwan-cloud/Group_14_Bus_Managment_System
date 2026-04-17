"""Bookings App — Placeholder Models"""
from django.db import models
class Booking(models.Model):
    reference = models.CharField(max_length=20, default='TBD')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Booking'
    def __str__(self):
        return self.reference
