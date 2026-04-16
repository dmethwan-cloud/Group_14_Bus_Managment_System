"""
Common App — Email Utility Functions
Uses Django's built-in email system with Gmail SMTP.
"""

from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


import random
from django.utils import timezone

def send_verification_email(user):
    """
    Generate a 6-digit OTP, save it to the user, and send an email verification notification.
    """
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    user.otp = otp
    user.otp_created_at = timezone.now()
    user.save(update_fields=['otp', 'otp_created_at'])

    subject = 'Smart Bus E-Ticketing System — Verify Your Email (OTP)'
    message = f"""
Hi {user.full_name},

Welcome to Smart Bus E-Ticketing System!

Your account has been created successfully. To activate your account and securely log in, please use the following 6-digit Verification PIN:

Your OTP PIN: {otp}

(This code will expire in 10 minutes)

If you did not register for this account, please ignore this email.

Best regards,
Smart Bus E-Ticketing Team
    """.strip()

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f'Verification email sent to {user.email}')
    except Exception as e:
        logger.error(f'Failed to send verification email to {user.email}: {e}')
        raise


def send_custom_email(subject, message, recipient_list):
    """
    Generic email sender utility.
    Use this for notifications, password resets, booking confirmations, etc.

    Args:
        subject (str): Email subject
        message (str): Plain text email body
        recipient_list (list): List of recipient email addresses
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        logger.info(f'Email sent to {", ".join(recipient_list)}')
        return True
    except Exception as e:
        logger.error(f'Failed to send email: {e}')
        return False


def send_booking_confirmation_email(user, booking_details):
    """
    Placeholder: Send booking confirmation email to passenger.
    Implement fully when booking module is ready.
    """
    subject = 'Booking Confirmation — Smart Bus E-Ticketing'
    message = f"""
Hi {user.full_name},

Your booking has been confirmed!

Booking Details:
{booking_details}

Thank you for using Smart Bus E-Ticketing System.

Best regards,
Smart Bus E-Ticketing Team
    """.strip()

    return send_custom_email(subject, message, [user.email])
