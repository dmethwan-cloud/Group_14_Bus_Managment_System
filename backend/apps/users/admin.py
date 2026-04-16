"""
Users App — Django Admin Registration
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ['email', 'full_name', 'role', 'is_verified', 'is_active', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active', 'is_staff']
    search_fields = ['email', 'full_name']
    ordering = ['-created_at']

    fieldsets = (
        ('Credentials', {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Role & Status', {'fields': ('role', 'is_verified', 'is_active', 'is_staff', 'is_superuser')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
        ('Timestamps', {'fields': ('created_at',), 'classes': ('collapse',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'role', 'password1', 'password2', 'is_staff', 'is_verified'),
        }),
    )

    readonly_fields = ['created_at']
