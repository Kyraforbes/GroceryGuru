from django import forms
from .models import Habit, HabitLog

class HabitForm(forms.ModelForm):
    class Meta:
        model = Habit
        fields = ['name', 'amount_per_day', 'target_days_per_week']

class HabitLogForm(forms.ModelForm):
    class Meta:
        model = HabitLog
        fields = ['completed', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 2}),
        }