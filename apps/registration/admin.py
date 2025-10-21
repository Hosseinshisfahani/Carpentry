from django.contrib import admin
from .models import AbstractUser

# Register your models here.
@admin.register(AbstractUser)
class AbstractUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone', 'is_admin')
    list_filter = ('is_admin',)
    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)

