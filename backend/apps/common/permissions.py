"""
Common App — Custom DRF Permission Classes
"""

from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Allow access only to users with role='admin'."""
    message = 'Access restricted to administrators only.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )


class IsOperatorUser(BasePermission):
    """Allow access only to users with role='operator'."""
    message = 'Access restricted to bus operators only.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'operator'
        )


class IsConductorUser(BasePermission):
    """Allow access only to users with role='conductor'."""
    message = 'Access restricted to conductors only.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'conductor'
        )


class IsPassengerUser(BasePermission):
    """Allow access only to users with role='passenger'."""
    message = 'Access restricted to passengers only.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'passenger'
        )


class IsAdminOrOperator(BasePermission):
    """Allow access to admins and operators."""
    message = 'Access restricted to admins and operators.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['admin', 'operator']
        )
