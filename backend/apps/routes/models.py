"""
Routes App — Route Model
Admin creates routes (From → To) with AC and Non-AC fares.
"""

from django.db import models
from django.conf import settings


class Route(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    name = models.CharField(max_length=220, blank=True, editable=False)
    fare_ac = models.DecimalField(max_digits=8, decimal_places=2)
    fare_non_ac = models.DecimalField(max_digits=8, decimal_places=2)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_routes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Route'
        verbose_name_plural = 'Routes'
        ordering = ['origin', 'destination']
        unique_together = ['origin', 'destination']

    def save(self, *args, **kwargs):
        self.name = f"{self.origin} to {self.destination}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
