"""
Buses App — Placeholder Models
TODO: Implemented by teammate responsible for bus management.

Fields to add:
- Bus number, type, capacity
- Operator (FK to CustomUser where role=operator)
- Status (active, inactive, under maintenance)
- Seat layout (FK to SeatLayout)
"""

from django.db import models


class Bus(models.Model):
    """
    Placeholder Bus model.
    Full implementation by bus management module team member.
    """
    # Placeholder field — replace with full implementation
    name = models.CharField(max_length=100, default='TBD')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Bus'
        verbose_name_plural = 'Buses'

    def __str__(self):
        return self.name
