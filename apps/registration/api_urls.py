from django.urls import path
from .views import register_view, login_view, logout_view, user_profile

urlpatterns = [
    path('register/', register_view, name='api_register'),
    path('login/', login_view, name='api_login'),
    path('logout/', logout_view, name='api_logout'),
    path('profile/', user_profile, name='api_profile'),
]
