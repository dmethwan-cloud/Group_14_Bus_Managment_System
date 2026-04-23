"""Buses App — URLs"""

from django.urls import path
from .views import (
    BusListCreateView,
    BusDetailView,
    AssignmentListCreateView,
    AssignmentDetailView,
    AdminAssignmentListView,
    AssignmentStatusView,
    BusSearchView,
)

urlpatterns = [
    # Bus CRUD (operator-scoped)
    path('', BusListCreateView.as_view(), name='bus-list-create'),
    path('<int:pk>/', BusDetailView.as_view(), name='bus-detail'),

    # Assignment CRUD (operator-scoped)
    path('assignments/', AssignmentListCreateView.as_view(), name='assignment-list-create'),
    path('assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment-detail'),

    # Admin views all + approves/rejects
    path('assignments/all/', AdminAssignmentListView.as_view(), name='assignment-admin-list'),
    path('assignments/<int:pk>/status/', AssignmentStatusView.as_view(), name='assignment-status'),

    # Passenger search
    path('search/', BusSearchView.as_view(), name='bus-search'),
]
