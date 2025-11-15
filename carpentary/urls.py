"""
URL configuration for carpentary project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as static_serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.registration.api_urls')),
    path('api/', include('apps.projects.api_urls')),
    path('', include('apps.registration.urls')),
    path('projects/', include('apps.projects.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Provide a lightweight fallback for environments where DEBUG is False but
    # media files still need to be served by Django (e.g. docker-compose dev).
    # In production, a dedicated web server should handle /media/.
    media_url = settings.MEDIA_URL.lstrip('/')
    urlpatterns += [
        re_path(rf'^{media_url}(?P<path>.*)$', static_serve, {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': False,
        }),
    ]
