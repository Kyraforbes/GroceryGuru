from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import UserProfile, MealPlan, Meal, ShoppingList, ShoppingListItem
from .serializers import (UserProfileSerializer, MealPlanSerializer, 
                        MealSerializer, ShoppingListSerializer, 
                        ShoppingListItemSerializer, UserSerializer)

class RegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create a UserProfile instance for the new user
            UserProfile.objects.create(user=user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'email': user.email
            })
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            # Logout the user
            logout(request)
            return Response({'message': 'Successfully logged out'}, 
                          status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MealPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_meal(self, request, pk=None):
        meal_plan = self.get_object()
        serializer = MealSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(meal_plan=meal_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_meal(self, request, pk=None):
        meal_plan = self.get_object()
        meal_id = request.data.get('meal_id')
        meal = get_object_or_404(Meal, id=meal_id, meal_plan=meal_plan)
        meal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ShoppingListViewSet(viewsets.ModelViewSet):
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        shopping_list = self.get_object()
        serializer = ShoppingListItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(shopping_list=shopping_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def toggle_item(self, request, pk=None):
        shopping_list = self.get_object()
        item_id = request.data.get('item_id')
        item = get_object_or_404(ShoppingListItem, id=item_id, shopping_list=shopping_list)
        item.is_checked = not item.is_checked
        item.save()
        return Response({'status': 'item toggled'})

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        shopping_list = self.get_object()
        item_id = request.data.get('item_id')
        item = get_object_or_404(ShoppingListItem, id=item_id, shopping_list=shopping_list)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def clear_completed(self, request, pk=None):
        shopping_list = self.get_object()
        ShoppingListItem.objects.filter(
            shopping_list=shopping_list,
            is_checked=True
        ).delete()
        return Response({'status': 'completed items cleared'})

    @action(detail=True, methods=['post'])
    def update_from_meal_plan(self, request, pk=None):
        try:
            shopping_list = self.get_object()
            meal_plan_id = request.data.get('meal_plan_id')
            
            # Verify meal plan exists and belongs to user
            meal_plan = get_object_or_404(MealPlan, id=meal_plan_id, user=self.request.user)
            
            # Get all meals from the meal plan
            meals = Meal.objects.filter(meal_plan=meal_plan)
            
            # Track added items to avoid duplicates
            added_items = set()
            
            for meal in meals:
                # Assuming each meal has ingredients stored in JSON format
                # Format example: [{"item": "Tomatoes", "quantity": "2"}, ...]
                ingredients = meal.ingredients
                
                for ingredient in ingredients:
                    item_text = f"{ingredient['quantity']} {ingredient['item']}"
                    
                    # Check if this item is already in our added items set
                    if item_text not in added_items:
                        # Create new shopping list item
                        ShoppingListItem.objects.create(
                            shopping_list=shopping_list,
                            text=item_text,
                            is_checked=False
                        )
                        added_items.add(item_text)
            
            # Update the shopping list's meal plan reference
            shopping_list.meal_plan = meal_plan
            shopping_list.save()
            
            return Response({
                'status': 'success',
                'message': 'Shopping list updated from meal plan',
                'items_added': len(added_items)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)