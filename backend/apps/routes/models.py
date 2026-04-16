"""Routes App — Placeholder Models"""
from django.db import models
class Route(models.Model):
    name = models.CharField(max_length=100, default='TBD')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Route'
    def __str__(self):
        return self.name
