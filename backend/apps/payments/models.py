"""Payments App — Placeholder Models"""
from django.db import models
class Payment(models.Model):
    transaction_id = models.CharField(max_length=50, default='TBD')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Payment'
    def __str__(self):
        return self.transaction_id
