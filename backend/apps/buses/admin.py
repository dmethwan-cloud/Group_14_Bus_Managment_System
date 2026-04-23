"""Buses Admin registration"""
from django.contrib import admin
from .models import Bus, BusAssignment


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ['bus_number', 'bus_name', 'num_seats', 'is_ac', 'operator', 'created_at']
    search_fields = ['bus_number', 'bus_name']
    list_filter = ['is_ac']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BusAssignment)
class BusAssignmentAdmin(admin.ModelAdmin):
    list_display = ['bus', 'route', 'date', 'departure_time', 'arrival_time', 'status', 'reviewed_by']
    list_filter = ['status', 'date']
    search_fields = ['bus__bus_number', 'route__name']
    readonly_fields = ['submitted_at', 'updated_at', 'reviewed_at']
