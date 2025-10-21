from django.db import models
from django.urls import reverse
from apps.registration.models import AbstractUser

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(AbstractUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='projects/pictures')

    class Meta:
        verbose_name = "پروژه"
        verbose_name_plural = "پروژه ها"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('projects:project_detail', args=[str(self.id)])