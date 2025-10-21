from django import forms
from .models import Project

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'image']
        labels = {
            'title': 'عنوان پروژه',
            'description': 'توضیحات',
            'image': 'تصویر پروژه',
        }
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'عنوان پروژه را وارد کنید'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'توضیحات پروژه را وارد کنید'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
        }
