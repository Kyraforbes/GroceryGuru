from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'profile', views.UserProfileViewSet, basename='profile')
router.register(r'meal-plans', views.MealPlanViewSet, basename='meal-plan')
router.register(r'shopping-list', views.ShoppingListViewSet, basename='shopping-list')

urlpatterns = [
    # Custom endpoints for shopping list operations
    path('shopping-list/<int:list_id>/add_item/',
         views.ShoppingListViewSet.as_view({'post': 'add_item'}),
         name='shopping-list-add-item'),

    path('shopping-list/<int:list_id>/toggle_item/',
         views.ShoppingListViewSet.as_view({'post': 'toggle_item'}),
         name='shopping-list-toggle-item'),

    path('shopping-list/<int:list_id>/items/<int:item_id>/',
         views.ShoppingListViewSet.as_view({'delete': 'remove_item'}),
         name='shopping-list-remove-item'),

    # User registration and auth endpoints
    path('register/',
         views.RegistrationView.as_view(),
         name='register'),

    path('login/',
         views.LoginView.as_view(),
         name='login'),

    path('logout/',
         views.LogoutView.as_view(),
         name='logout'),

    path('api/token/',
         obtain_auth_token,
         name='api_token'),
] + router.urls