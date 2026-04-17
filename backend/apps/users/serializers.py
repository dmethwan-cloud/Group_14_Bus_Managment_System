"""
Users App — Serializers
Handles: Registration, Login, User Profile
"""

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for new user registration."""

    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirm Password')

    class Meta:
        model = CustomUser
        fields = ['email', 'full_name', 'role', 'password', 'password2']
        extra_kwargs = {
            'role': {'required': False},  # defaults to passenger
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def validate_role(self, value):
        # Prevent self-registration as admin
        if value == CustomUser.Role.ADMIN:
            raise serializers.ValidationError('Cannot self-register as admin.')
        return value

    def create(self, validated_data):
        role = validated_data.get('role', CustomUser.Role.PASSENGER)
        # Automatically activate passengers, but require admin approval for operators and conductors
        is_active = True if role == CustomUser.Role.PASSENGER else False
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=role,
            is_active=is_active
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login — returns JWT tokens."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )

        if not user:
            # authenticate() returns None if user is inactive. Let's check why:
            try:
                user_obj = CustomUser.objects.get(email=email)
                if user_obj.check_password(password) and not user_obj.is_active:
                    if user_obj.role in ['operator', 'conductor']:
                        raise serializers.ValidationError('Your account is pending admin approval. You will be able to use the application once an admin approves your request.')
                    else:
                        raise serializers.ValidationError('This account has been deactivated.')
            except CustomUser.DoesNotExist:
                pass
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')
        
        if not user.is_verified:
            raise serializers.ValidationError('Your email is not verified. Please check your email for the OTP.')

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for reading user profile data."""

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'full_name', 'role',
            'is_verified', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'updated_at']


class UserListSerializer(serializers.ModelSerializer):
    """Minimal serializer for user lists (admin use)."""

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role', 'is_verified', 'is_active', 'created_at']


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot-password: validates that the email exists."""

    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('No account found with this email address.')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for reset-password: validates OTP and new password."""

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for change-password: logged-in user changes their own password."""

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs
