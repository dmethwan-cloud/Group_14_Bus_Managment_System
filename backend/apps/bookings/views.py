"""Bookings App — Views"""

from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
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
        return Booking.objects.filter(user=self.request.user)

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
        )

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
        )
