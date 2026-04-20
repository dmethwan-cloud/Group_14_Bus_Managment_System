"""Routes App — Views"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Route
from .serializers import RouteSerializer


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class RouteListCreateView(generics.ListCreateAPIView):
    """
    GET  — Any authenticated user can list routes.
    POST — Admin only can create routes.
    """
    serializer_class = RouteSerializer

    def get_queryset(self):
        return Route.objects.all()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class RouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    — Any authenticated user can retrieve a route.
    PUT/PATCH/DELETE — Admin only.
    """
    serializer_class = RouteSerializer
    queryset = Route.objects.all()

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]
