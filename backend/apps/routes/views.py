"""Routes App — Placeholder Views"""
from rest_framework.views import APIView
from rest_framework.response import Response
class RoutePlaceholderView(APIView):
    def get(self, request):
        return Response({'message': 'Route management module — coming soon.'})
