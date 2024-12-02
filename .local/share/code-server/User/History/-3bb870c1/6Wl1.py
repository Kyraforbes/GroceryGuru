from django.urls import path
from . import views

urlpatterns = [
    path('hellouser/', views.user_form, name='user_form'),
    path('api/habits/', views.habit_api, name='habit_api'),
    path('api/habits/<int:habit_id>/', views.habit_detail, name='habit_detail'),
    path('api/habits/<int:habit_id>/log/', views.habit_log, name='habit_log'),
]