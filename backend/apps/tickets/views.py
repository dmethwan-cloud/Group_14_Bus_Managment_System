"""Tickets App — Placeholder Views"""
from rest_framework.views import APIView
from rest_framework.response import Response
class TicketPlaceholderView(APIView):
    def get(self, request):
        return Response({'message': 'Ticket system module — coming soon.'})
