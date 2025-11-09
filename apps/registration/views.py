from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.conf import settings
from .models import AbstractUser
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    UserUpdateSerializer, 
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)


def home(request):
    """صفحه اصلی"""
    return redirect('projects:project_list')


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'حساب کاربری شما با موفقیت ایجاد شد!',
            'user': UserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        # Explicitly save the session to ensure cookie is set
        request.session.save()
        user_data = UserSerializer(user, context={'request': request}).data
        return Response({
            'message': f'خوش آمدید {user.username}!',
            'user': user_data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'message': 'با موفقیت خارج شدید.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile including avatar"""
    user = request.user
    serializer = UserUpdateSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        # Return updated user data with avatar_url
        updated_serializer = UserSerializer(user, context={'request': request})
        return Response({
            'message': 'پروفایل با موفقیت به‌روزرسانی شد.',
            'user': updated_serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({
            'message': 'رمز عبور با موفقیت تغییر کرد.'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Request password reset - sends email with reset link"""
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = AbstractUser.objects.get(email=email, is_active=True)
            # Generate token and uid
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Build reset URL (adjust this based on your frontend URL)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"
            
            # Send email
            subject = 'بازیابی رمز عبور'
            message = f'''
سلام {user.username}،

برای بازیابی رمز عبور خود، لطفاً روی لینک زیر کلیک کنید:

{reset_url}

اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.

با تشکر
'''
            html_message = f'''
<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; direction: rtl;">
    <h2>بازیابی رمز عبور</h2>
    <p>سلام {user.username}،</p>
    <p>برای بازیابی رمز عبور خود، لطفاً روی لینک زیر کلیک کنید:</p>
    <p><a href="{reset_url}" style="display: inline-block; padding: 10px 20px; background-color: #8b4513; color: white; text-decoration: none; border-radius: 5px;">بازیابی رمز عبور</a></p>
    <p>یا لینک زیر را در مرورگر خود باز کنید:</p>
    <p style="word-break: break-all; color: #666;">{reset_url}</p>
    <p>اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
    <p>با تشکر</p>
</div>
'''
            
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
                    recipient_list=[email],
                    html_message=html_message,
                    fail_silently=False,
                )
            except Exception as e:
                # Log error but don't reveal it to user for security
                return Response({
                    'message': 'خطایی در ارسال ایمیل رخ داد. لطفاً دوباره تلاش کنید.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Always return success message for security (don't reveal if email exists)
            return Response({
                'message': 'اگر ایمیل شما در سیستم ثبت شده باشد، لینک بازیابی رمز عبور به ایمیل شما ارسال شد.'
            }, status=status.HTTP_200_OK)
        except AbstractUser.DoesNotExist:
            # Don't reveal if email exists or not
            return Response({
                'message': 'اگر ایمیل شما در سیستم ثبت شده باشد، لینک بازیابی رمز عبور به ایمیل شما ارسال شد.'
            }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """Confirm password reset with token"""
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            # Decode user ID
            user_id = force_str(urlsafe_base64_decode(uid))
            user = AbstractUser.objects.get(pk=user_id, is_active=True)
        except (TypeError, ValueError, OverflowError, AbstractUser.DoesNotExist):
            return Response({
                'message': 'لینک بازیابی رمز عبور نامعتبر است.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response({
                'message': 'لینک بازیابی رمز عبور منقضی شده یا نامعتبر است.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'رمز عبور با موفقیت تغییر کرد. می‌توانید با رمز عبور جدید وارد شوید.'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)