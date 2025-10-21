
from django import forms
from .models import *
from django.contrib.auth import authenticate

class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'رمز عبور قوی انتخاب کنید'}), label="رمز عبور")
    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'رمز عبور را مجدداً وارد کنید'}), label="تایید رمز عبور")

    class Meta:
        model = AbstractUser
        fields = ['username', 'email', 'phone']
        labels = {
            'username': 'نام کاربری',
            'email': 'ایمیل',
            'phone': 'شماره تلفن',
        }
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'نام کاربری خود را وارد کنید'}),
            'email': forms.EmailInput(attrs={'placeholder': 'example@email.com'}),
            'phone': forms.TextInput(attrs={'placeholder': '09123456789'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', "رمز عبور و تایید رمز عبور مطابقت ندارند.")
        return cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField(
        label="نام کاربری",
        widget=forms.TextInput(attrs={'placeholder': 'نام کاربری خود را وارد کنید'})
    )
    password = forms.CharField(
        label="رمز عبور",
        widget=forms.PasswordInput(attrs={'placeholder': 'رمز عبور خود را وارد کنید'})
    )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                self.add_error('username', "نام کاربری یا رمز عبور اشتباه است.")
        
        return cleaned_data