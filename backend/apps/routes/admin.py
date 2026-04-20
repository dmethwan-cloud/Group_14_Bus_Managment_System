"""Routes Admin registration"""
from django.contrib import admin
from .models import Route

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['name', 'origin', 'destination', 'fare_ac', 'fare_non_ac', 'created_by', 'created_at']
    search_fields = ['origin', 'destination']
    readonly_fields = ['name', 'created_at', 'updated_at']
