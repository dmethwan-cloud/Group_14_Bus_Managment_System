"""
Custom User Model for Smart Bus E-Ticketing System
Uses email as the login field instead of username.
Roles: admin, operator, conductor, passenger
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .manager import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model with email-based authentication and role support.
    """

    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        OPERATOR = 'operator', 'Bus Operator'
        CONDUCTOR = 'conductor', 'Conductor'
        PASSENGER = 'passenger', 'Passenger'

    # ── Core Fields ────────────────────────────────────────────
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PASSENGER,
    )

    # ── Status Flags ──────────────────────────────────────────
    is_verified = models.BooleanField(
        default=False,
        help_text='Email verification status'
    )
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # ── Timestamps ────────────────────────────────────────────
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # ── Auth Configuration ────────────────────────────────────
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_operator(self):
        return self.role == self.Role.OPERATOR

    @property
    def is_conductor(self):
        return self.role == self.Role.CONDUCTOR

    @property
    def is_passenger(self):
        return self.role == self.Role.PASSENGER
