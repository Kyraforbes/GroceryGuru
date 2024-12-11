from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    AGE_GROUP_CHOICES = [
        ('under_18', 'Under 18'),
        ('18_25', '18-25'),
        ('26_35', '26-35'),
        ('36_50', '36-50'),
        ('51_above', '51 and above'),
    ]
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('bi_weekly', 'Bi-weekly'),
        ('monthly', 'Monthly'),
    ]

    EATING_OUT_FREQUENCY_CHOICES = [
        ('1_per_week', '1 time per week'),
        ('2_per_week', '2 times per week'),
        ('3_per_week', '3 times per week'),
        ('4_plus_per_week', '4 or more times per week'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES, blank=True)
    shopping_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, blank=True)
    eating_out_frequency = models.CharField(
        max_length=20, 
        choices=EATING_OUT_FREQUENCY_CHOICES,
        blank=True  # Make this field optional initially
    )
    allergies = models.TextField(blank=True)
    other_preferences = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s meal plan - {self.name}"

class Meal(models.Model):
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name='meals')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    ingredients = models.JSONField(default=list)  # Added this field for meal ingredients
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ShoppingList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Shopping List"

class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='items')
    text = models.CharField(max_length=200)
    is_checked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()