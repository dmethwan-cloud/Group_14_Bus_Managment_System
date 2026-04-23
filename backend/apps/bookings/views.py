"""Bookings App — Views"""

from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Booking
from apps.buses.models import BusAssignment
from .serializers import BookingSerializer, BookingCreateSerializer
from apps.buses.serializers import BusAssignmentSerializer
from apps.common.permissions import IsConductorUser, IsPassengerUser

class PassengerBookingListCreateView(generics.ListCreateAPIView):
    """
    GET /api/bookings/ - List passenger's bookings
    POST /api/bookings/ - Create a booking
    """
    permission_classes = [permissions.IsAuthenticated, IsPassengerUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related(
            'user', 'bus_assignment', 
            'bus_assignment__bus', 'bus_assignment__route', 'bus_assignment__conductor'
        )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConductorTripListView(generics.ListAPIView):
    """
    GET /api/bookings/conductor/trips/ - List trips assigned to conductor
    """
    permission_classes = [permissions.IsAuthenticated, IsConductorUser]
    serializer_class = BusAssignmentSerializer

    def get_queryset(self):
        return BusAssignment.objects.filter(
            conductor=self.request.user,
            status=BusAssignment.STATUS_APPROVED
        ).select_related('bus', 'route', 'conductor')

class ConductorBookingListView(generics.ListAPIView):
    """
    GET /api/bookings/conductor/trips/<pk>/bookings/ - List bookings for a trip
    """
    permission_classes = [permissions.IsAuthenticated, IsConductorUser]
    serializer_class = BookingSerializer

    def get_queryset(self):
        trip_id = self.kwargs.get('pk')
        return Booking.objects.filter(
            bus_assignment_id=trip_id,
            bus_assignment__conductor=self.request.user,
            payment_status__in=['pending', 'accepted']
        ).select_related(
            'user', 'bus_assignment',
            'bus_assignment__bus', 'bus_assignment__route', 'bus_assignment__conductor'
        )


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, IsConductorUser])
def conductor_verify_payment(request, booking_id):
    """
    PATCH /api/bookings/verify-payment/<booking_id>/ - Conductor verifies payment
    """
    try:
        booking = Booking.objects.get(id=booking_id)
        
        # Verify conductor is assigned to this booking's trip
        if booking.bus_assignment.conductor != request.user:
            return Response(
                {'detail': 'You are not assigned to this booking.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update payment status
        payment_status = request.data.get('payment_status')
        if payment_status not in ['accepted', 'failed', 'pending']:
            return Response(
                {'detail': 'Invalid payment status.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.payment_status = payment_status
        if payment_status == 'failed' and 'rejection_reason' in request.data:
            booking.rejection_reason = request.data.get('rejection_reason')
        
        booking.save()
        return Response(BookingSerializer(booking).data)
    
    except Booking.DoesNotExist:
        return Response(
            {'detail': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )