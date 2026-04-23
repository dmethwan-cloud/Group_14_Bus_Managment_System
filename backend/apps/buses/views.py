"""
Buses App — Views

Bus views:       Operator creates/edits/deletes their own buses.
Assignment views: Operator submits/edits/deletes assignments.
                  Editing resets status to 'pending' for re-approval.
Approval view:   Admin approves or rejects assignment requests.
Search view:     Passenger searches approved assignments by route + date.
"""

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Bus, BusAssignment
from .serializers import BusSerializer, BusAssignmentSerializer


# ── Custom Permission Classes ────────────────────────────────────────────────

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOperatorUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'operator'


class IsAdminOrOperator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'operator']


# ── Bus Views ────────────────────────────────────────────────────────────────

class BusListCreateView(generics.ListCreateAPIView):
    """
    GET  — Admin sees all buses. Operator sees only their own.
    POST — Operator adds a new bus.
    """
    serializer_class = BusSerializer
    permission_classes = [IsAdminOrOperator]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Bus.objects.all()
        return Bus.objects.filter(operator=self.request.user)

    def perform_create(self, serializer):
        # Only operators can create buses
        if self.request.user.role != 'operator':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only operators can add buses.")
        serializer.save(operator=self.request.user)


class BusDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin can view all buses (read-only).
    Operator can view, edit, delete their own buses only.
    """
    serializer_class = BusSerializer
    permission_classes = [IsAdminOrOperator]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Bus.objects.all()
        return Bus.objects.filter(operator=self.request.user)

    def perform_update(self, serializer):
        # Only operators can edit buses
        if self.request.user.role != 'operator':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only operators can edit buses.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only operators can delete buses
        if self.request.user.role != 'operator':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only operators can delete buses.")
        instance.delete()


# ── Assignment Views ─────────────────────────────────────────────────────────

class AssignmentListCreateView(generics.ListCreateAPIView):
    """
    GET  — Operator sees their own assignments (filtered by their buses).
    POST — Operator submits a new assignment request.
    """
    serializer_class = BusAssignmentSerializer
    permission_classes = [IsOperatorUser]

    def get_queryset(self):
        return BusAssignment.objects.filter(bus__operator=self.request.user)

    def perform_create(self, serializer):
        # Validate bus belongs to this operator
        bus = serializer.validated_data['bus']
        if bus.operator != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only assign your own buses.")
        serializer.save(status=BusAssignment.STATUS_PENDING)


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Operator can view, edit, delete their own assignment requests.
    PATCH/PUT — Resets status to 'pending' so admin must re-approve.
    """
    serializer_class = BusAssignmentSerializer
    permission_classes = [IsOperatorUser]

    def get_queryset(self):
        return BusAssignment.objects.filter(bus__operator=self.request.user)

    def perform_update(self, serializer):
        # Reset to pending on any edit — requires admin re-approval
        serializer.save(
            status=BusAssignment.STATUS_PENDING,
            reviewed_by=None,
            reviewed_at=None
        )


# ── Admin Approval View ──────────────────────────────────────────────────────

class AdminAssignmentListView(generics.ListAPIView):
    """
    Admin views ALL assignment requests across all operators.
    """
    serializer_class = BusAssignmentSerializer
    permission_classes = [IsAdminUser]
    queryset = BusAssignment.objects.all()


class AssignmentStatusView(APIView):
    """
    PATCH /api/buses/assignments/<pk>/status/
    Admin approves or rejects an assignment.
    Body: { "status": "approved" | "rejected" }
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            assignment = BusAssignment.objects.get(pk=pk)
        except BusAssignment.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in [BusAssignment.STATUS_APPROVED, BusAssignment.STATUS_REJECTED]:
            return Response(
                {'detail': 'Status must be "approved" or "rejected".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        assignment.status = new_status
        assignment.reviewed_by = request.user
        assignment.reviewed_at = timezone.now()
        assignment.save()

        serializer = BusAssignmentSerializer(assignment)
        return Response(serializer.data)


# ── Passenger Search View ────────────────────────────────────────────────────

class BusSearchView(APIView):
    """
    GET /api/buses/search/?from=Colombo&to=Kandy&date=2024-01-15
    Returns approved assignments matching the route and date.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        origin = request.query_params.get('from', '').strip()
        destination = request.query_params.get('to', '').strip()
        date = request.query_params.get('date', '').strip()

        if not origin or not destination:
            return Response(
                {'detail': 'Both "from" and "to" query params are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = BusAssignment.objects.filter(
            status=BusAssignment.STATUS_APPROVED,
            route__origin__iexact=origin,
            route__destination__iexact=destination,
        )

        if date:
            qs = qs.filter(date=date)

        serializer = BusAssignmentSerializer(qs, many=True)
        return Response(serializer.data)