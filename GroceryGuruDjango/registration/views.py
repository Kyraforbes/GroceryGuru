import random
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import UserInfo
from .forms import UserInfoForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserInfoSerializer
from habit_app.models import Habit, HabitLog 
from django.utils import timezone
from datetime import timedelta

# Keep your existing functions
def generate_unique_user_id():
    while True:
        user_id = random.randint(100000, 999999)
        if not UserInfo.objects.filter(UserID=user_id).exists():
            return user_id

def registration_api(request):
    if request.method == 'POST':
        form = UserInfoForm(request.POST)
        if form.is_valid():
            user_info = form.save(commit=False)
            user_info.UserID = generate_unique_user_id()
            user_info.save()
            return JsonResponse({"message": "User info added successfully!"}, status=201)
        else:
            return JsonResponse({"errors": form.errors}, status=400)
    else:
        form = UserInfoForm()
    return render(request, 'registration/registrationForm.html', {'form': form})

@api_view(['GET'])
def user_list_api(request):
    users = UserInfo.objects.all()
    serializer = UserInfoSerializer(users, many=True)
    return Response(serializer.data)

class AddUser(APIView):
    def get(self, request):
        users = UserInfo.objects.all()
        serializer = UserInfoSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        data['UserID'] = generate_unique_user_id()
        serializer = UserInfoSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add new habit-related views
def habit_list(request):
    habits = Habit.objects.all()
    if request.method == 'POST':
        form = HabitForm(request.POST)
        if form.is_valid():
            habit = form.save(commit=False)
            # If you want to associate with UserInfo instead of Django's User model
            habit.user_info = UserInfo.objects.first()  # Modify this according to your needs
            habit.save()
            return JsonResponse({"message": "Habit created successfully!"}, status=201)
    else:
        form = HabitForm()
    
    return render(request, 'GroceryGuru_app/habit_list.html', {
        'habits': habits,
        'form': form
    })

def habit_detail(request, pk):
    habit = get_object_or_404(Habit, pk=pk)
    today = timezone.now().date()
    
    # Get or create today's log
    log, created = HabitLog.objects.get_or_create(
        habit=habit,
        date=today,
        defaults={'completed': False}
    )
    
    # Get last 7 days of logs
    date_range = [today - timedelta(days=x) for x in range(7)]
    logs = HabitLog.objects.filter(
        habit=habit,
        date__in=date_range
    ).order_by('-date')
    
    return render(request, 'GroceryGuru_app/habit_detail.html', {
        'habit': habit,
        'logs': logs
    })

# Add API endpoints for habits
@api_view(['GET'])
def habit_list_api(request):
    habits = Habit.objects.all()
    serializer = HabitSerializer(habits, many=True)
    return Response(serializer.data)

class HabitAPI(APIView):
    def get(self, request):
        habits = Habit.objects.all()
        serializer = HabitSerializer(habits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HabitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)