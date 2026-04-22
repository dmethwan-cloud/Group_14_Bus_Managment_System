"""
Users App — Views
Endpoints: Register, Login, Logout, Me, User List (admin), Forgot/Reset/Change Password
"""

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import CustomUser
from .serializers import (
    RegisterSerializer, LoginSerializer, UserProfileSerializer,
    UserListSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,
    ChangePasswordSerializer,
)
from apps.common.permissions import IsAdminUser
from apps.common.email_utils import send_verification_email, send_password_reset_email
from django.utils import timezone
from datetime import timedelta


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Register a new user (passenger, operator, or conductor).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send verification email (non-blocking; fails gracefully)
            try:
                send_verification_email(user)
            except Exception:
                pass  # Do not block registration if email fails

            message = 'Registration successful. Please check your email for the OTP verification code.'
            if user.role in ['operator', 'conductor']:
                message = 'Registration successful. Your account is pending admin approval. Please verify your OTP.'

            # We do NOT return tokens here anymore because they must verify OTP first!
            return Response({
                'message': message,
                'user': UserProfileSerializer(user).data,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticate user and return JWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            data = serializer.validated_data
            user = data['user']
            return Response({
                'message': 'Login successful.',
                'user': UserProfileSerializer(user).data,
                'access': data['access'],
                'refresh': data['refresh'],
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class VerifyOTPView(APIView):
    """
    POST /api/auth/verify-otp/
    Verify email via 6-digit OTP code before allowing login.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_verified:
            return Response({'message': 'Email is already verified.'}, status=status.HTTP_400_BAD_REQUEST)

        if str(user.otp) != str(otp):
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP expired (10 minutes)
        if user.otp_created_at and timezone.now() > user.otp_created_at + timedelta(minutes=10):
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        # Success - Mark as verified!
        user.is_verified = True
        user.otp = None
        user.otp_created_at = None
        user.save()

        return Response({'message': 'Email verified successfully. You can now log in.'}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklist the refresh token to invalidate the session.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    GET  /api/auth/me/  — Get current user profile
    PATCH /api/auth/me/ — Update current user profile
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    GET /api/auth/users/
    Admin only — list all users.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserListSerializer
    queryset = CustomUser.objects.all().order_by('-created_at')


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/auth/users/<id>/   — Admin: view any user
    PATCH /api/auth/users/<id>/ — Admin: update any user
    DELETE /api/auth/users/<id>/ — Admin: delete any user
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserListSerializer
    queryset = CustomUser.objects.all()

class ConductorListView(generics.ListAPIView):
    """
    GET /api/auth/conductors/
    Admin and Operator — list all active conductors.
    """
    from apps.common.permissions import IsAdminOrOperator
    permission_classes = [IsAuthenticated, IsAdminOrOperator]
    serializer_class = UserListSerializer
    
    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.CONDUCTOR, is_active=True, is_verified=True).order_by('full_name')

class ForgotPasswordView(APIView):
    """
    POST /api/auth/forgot-password/
    Send OTP for password reset
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = CustomUser.objects.get(email=email)
            try:
                send_password_reset_email(user)
                return Response({'message': 'Password reset OTP sent to your email.'}, status=status.HTTP_200_OK)
            except Exception:
                return Response({'error': 'Failed to send email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    """
    POST /api/auth/reset-password/
    Reset password using OTP
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']

            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

            if str(user.otp) != str(otp):
                return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

            if user.otp_created_at and timezone.now() > user.otp_created_at + timedelta(minutes=10):
                return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.otp = None
            user.otp_created_at = None
            user.save()

            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    Change password for logged-in user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            user = request.user
            if not user.check_password(old_password):
                return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
