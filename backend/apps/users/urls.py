"""
Users App — URL Configuration
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    VerifyOTPView,
    MeView,
    UserListView,
    UserDetailView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='auth-verify-otp'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Current user
    path('me/', MeView.as_view(), name='auth-me'),

    # Admin: user management
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
