from django.urls import path
from . import views

urlpatterns = [
    # Keep your existing URLs
    path('api/register/', views.registration_api, name='registration_api'),
    path('api/users/', views.user_list_api, name='user_list_api'),
    path('api/adduser/', views.AddUser.as_view(), name='add_user'),
    
    # Add new habit URLs
    path('habits/', views.habit_list, name='habit_list'),
    path('habits/<int:pk>/', views.habit_detail, name='habit_detail'),
    
    # Add new habit API endpoints
    path('api/habits/', views.habit_list_api, name='habit_list_api'),
    path('api/habits/manage/', views.HabitAPI.as_view(), name='habit_api'),
]