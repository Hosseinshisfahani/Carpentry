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


class BinPackingReport(models.Model):
    """Model to store bin packing optimization results"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='bin_packing_reports')
    name = models.CharField(max_length=200, verbose_name="نام گزارش")
    container_width = models.FloatField(verbose_name="عرض ورق")
    container_height = models.FloatField(verbose_name="ارتفاع ورق")
    rectangles = models.JSONField(verbose_name="قطعات")  # Array of {width, height}
    packed_rectangles = models.JSONField(verbose_name="قطعات چیده شده")  # Array of packed rectangles
    visualization = models.JSONField(verbose_name="داده‌های بصری")  # Full visualization data
    density = models.FloatField(verbose_name="چگالی")
    success = models.BooleanField(verbose_name="موفقیت")
    message = models.TextField(blank=True, verbose_name="پیام")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "گزارش بهینه‌سازی چیدمان"
        verbose_name_plural = "گزارش‌های بهینه‌سازی چیدمان"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.project.title}"