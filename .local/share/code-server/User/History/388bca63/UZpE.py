from django import forms
from .models import UserInfo  # Only import UserInfo since we moved Habit to habit_app

class UserInfoForm(forms.ModelForm):
    class Meta:
        model = UserInfo
        fields = ['FirstName', 'LastName', 'Business', 'Address', 'PhoneNumber']