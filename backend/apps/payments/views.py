"""Payments App — Placeholder Views"""
from rest_framework.views import APIView
from rest_framework.response import Response
class PaymentPlaceholderView(APIView):
    def get(self, request):
        return Response({'message': 'Payment system module — coming soon.'})
