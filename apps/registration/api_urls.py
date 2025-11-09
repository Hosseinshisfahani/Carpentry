from django.urls import path
from .views import register_view, login_view, logout_view, user_profile, update_profile, change_password, password_reset_request, password_reset_confirm

urlpatterns = [
    path('register/', register_view, name='api_register'),
    path('login/', login_view, name='api_login'),
    path('logout/', logout_view, name='api_logout'),
    path('profile/', user_profile, name='api_profile'),
    path('profile/update/', update_profile, name='api_profile_update'),
    path('profile/change-password/', change_password, name='api_change_password'),
    path('password-reset/request/', password_reset_request, name='api_password_reset_request'),
    path('password-reset/confirm/', password_reset_confirm, name='api_password_reset_confirm'),
]
