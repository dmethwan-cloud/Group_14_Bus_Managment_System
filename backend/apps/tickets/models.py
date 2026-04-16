"""Tickets App — Placeholder Models"""
from django.db import models
class Ticket(models.Model):
    ticket_number = models.CharField(max_length=20, default='TBD')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Ticket'
    def __str__(self):
        return self.ticket_number
