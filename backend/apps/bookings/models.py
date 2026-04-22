"""Bookings App — Models"""

import uuid
from django.db import models
from django.conf import settings
from apps.buses.models import BusAssignment

class Booking(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('online', 'Online Payment'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    bus_assignment = models.ForeignKey(BusAssignment, on_delete=models.CASCADE, related_name='bookings')
    
    seat_count = models.PositiveIntegerField()
    total_fare = models.DecimalField(max_digits=10, decimal_places=2)
    
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    payment_proof = models.FileField(upload_to='payment_proofs/', blank=True, null=True)
    
    purchase_id = models.CharField(max_length=50, unique=True, editable=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Booking'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.purchase_id:
            # Generate a unique purchase ID, e.g. BKG-YYYYMMDD-<uuid>
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            short_uuid = str(uuid.uuid4().hex)[:6].upper()
            self.purchase_id = f"BKG-{date_str}-{short_uuid}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.purchase_id} - {self.user.email} ({self.seat_count} seats)"
