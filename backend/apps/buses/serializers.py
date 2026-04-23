"""Buses App — Serializers"""

from rest_framework import serializers
from .models import Bus, BusAssignment
from apps.routes.serializers import RouteSerializer
from django.db.models import Sum


class BusSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='operator.full_name', read_only=True)
    bus_type = serializers.SerializerMethodField()

    class Meta:
        model = Bus
        fields = [
            'id', 'bus_number', 'bus_name', 'num_seats',
            'is_ac', 'bus_type', 'operator', 'operator_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'operator', 'operator_name', 'bus_type', 'created_at', 'updated_at']

    def get_bus_type(self, obj):
        return 'AC' if obj.is_ac else 'Non-AC'


class BusAssignmentSerializer(serializers.ModelSerializer):
    bus_detail = BusSerializer(source='bus', read_only=True)
    route_detail = RouteSerializer(source='route', read_only=True)
    operator_name = serializers.CharField(source='bus.operator.full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    conductor_name = serializers.CharField(source='conductor.full_name', read_only=True)
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = BusAssignment
        fields = [
            'id', 'bus', 'bus_detail', 'route', 'route_detail',
            'departure_time', 'arrival_time', 'date',
            'status', 'operator_name',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at',
            'conductor', 'conductor_name',
            'available_seats',
            'submitted_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'bus_detail', 'route_detail',
            'operator_name', 'reviewed_by', 'reviewed_by_name',
            'reviewed_at', 'conductor_name', 'available_seats', 'submitted_at', 'updated_at'
        ]

    def get_available_seats(self, obj):
        total = obj.bus.num_seats
        # Calculate booked seats
        # We check accepted and pending bookings
        booked = obj.bookings.filter(
            payment_status__in=['pending', 'accepted']
        ).aggregate(
            total_booked=Sum('seat_count')
        )['total_booked'] or 0
        return total - booked
