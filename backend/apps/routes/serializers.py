"""Routes App — Serializers"""

from rest_framework import serializers
from .models import Route


class RouteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.full_name', read_only=True
    )

    class Meta:
        model = Route
        fields = [
            'id', 'origin', 'destination', 'name',
            'fare_ac', 'fare_non_ac',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'name', 'created_by', 'created_by_name', 'created_at', 'updated_at']
