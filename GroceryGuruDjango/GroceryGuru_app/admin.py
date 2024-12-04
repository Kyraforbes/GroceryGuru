from django.contrib import admin
from .models import UserProfile, MealPlan, Meal, ShoppingList, ShoppingListItem

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'age_group', 'shopping_frequency', 'created_at')
    list_filter = ('age_group', 'shopping_frequency', 'eating_out_frequency')
    search_fields = ('user__username', 'allergies')

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'user__username')

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'meal_plan', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')

@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ('user', 'meal_plan', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)

@admin.register(ShoppingListItem)
class ShoppingListItemAdmin(admin.ModelAdmin):
    list_display = ('text', 'shopping_list', 'is_checked', 'created_at')
    list_filter = ('is_checked', 'created_at')
    search_fields = ('text', 'shopping_list__user__username')