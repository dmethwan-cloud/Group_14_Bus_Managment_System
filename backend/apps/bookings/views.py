"""Bookings App — Placeholder Views"""
from rest_framework.views import APIView
from rest_framework.response import Response
class BookingPlaceholderView(APIView):
    def get(self, request):
        return Response({'message': 'Booking system module — coming soon.'})
