"""Bookings App — Serializers"""

import os
from rest_framework import serializers
from django.db.models import Sum
from .models import Booking
from apps.buses.models import BusAssignment
from apps.buses.serializers import BusAssignmentSerializer
from apps.users.serializers import UserProfileSerializer

class BookingSerializer(serializers.ModelSerializer):
    bus_assignment_detail = BusAssignmentSerializer(source='bus_assignment', read_only=True)
    user_detail = UserProfileSerializer(source='user', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_detail', 'bus_assignment', 'bus_assignment_detail',
            'seat_count', 'total_fare', 'payment_method', 'payment_status',
            'payment_reference', 'payment_proof', 'purchase_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'bus_assignment', 'seat_count', 'payment_method',
            'payment_reference', 'payment_proof'
        ]

    def validate_payment_proof(self, value):
        if not value:
            return value
        
        # Validate size (~5MB)
        limit = 5 * 1024 * 1024
        if value.size > limit:
            raise serializers.ValidationError('File too large. Size should not exceed 5 MB.')

        # Validate format
        ext = os.path.splitext(value.name)[1].lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.pdf', '.gif', '.webp']
        if not ext in valid_extensions:
            raise serializers.ValidationError(f'Unsupported file extension. Allowed: {", ".join(valid_extensions)}')
        
        return value

    def validate(self, attrs):
        bus_assignment = attrs.get('bus_assignment')
        seat_count = attrs.get('seat_count')
        payment_method = attrs.get('payment_method')
        payment_reference = attrs.get('payment_reference')
        payment_proof = attrs.get('payment_proof')

        # Payment validation
        if payment_method == 'online':
            if not payment_reference:
                raise serializers.ValidationError({'payment_reference': 'Reference number is required for online payments.'})
            if not payment_proof:
                raise serializers.ValidationError({'payment_proof': 'Payment proof file is required for online payments.'})
        
        # Check seats
        if bus_assignment.status != BusAssignment.STATUS_APPROVED:
            raise serializers.ValidationError('Cannot book seats for unapproved assignments.')

        total_seats = bus_assignment.bus.num_seats
        booked = bus_assignment.bookings.filter(
            payment_status__in=['pending', 'accepted']
        ).aggregate(total=Sum('seat_count'))['total'] or 0

        if booked + seat_count > total_seats:
            raise serializers.ValidationError(f'Not enough seats available. Only {total_seats - booked} seats left.')

        # Calculate total fare based on AC/Non-AC
        fare = bus_assignment.route.fare_ac if bus_assignment.bus.is_ac else bus_assignment.route.fare_non_ac
        attrs['total_fare'] = fare * seat_count

        return attrs
