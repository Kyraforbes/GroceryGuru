from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Habit, HabitLog
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date

def user_form(request):
    return render(request, 'habit_app/dynamic_stuff.html')

@csrf_exempt
def habit_api(request):
    if request.method == 'GET':
        habits = Habit.objects.all()
        habits_list = [
            {
                'id': habit.id,
                'name': habit.name,
                'amount_per_day': habit.amount_per_day,  # Changed from description
                'target_days_per_week': habit.target_days_per_week,
                'created_at': habit.created_at.strftime('%Y-%m-%d')
            }
            for habit in habits
        ]
        return JsonResponse({'habits': habits_list})
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        habit = Habit.objects.create(
            name=data['name'],
            amount_per_day=data.get('amount_per_day', 1),  # Changed from description
            target_days_per_week=data['target_days_per_week']
        )
        return JsonResponse({
            'id': habit.id,
            'name': habit.name,
            'amount_per_day': habit.amount_per_day,  # Changed from description
            'target_days_per_week': habit.target_days_per_week,
            'created_at': habit.created_at.strftime('%Y-%m-%d')
        })

@csrf_exempt
def habit_detail(request, habit_id):
    if request.method == 'DELETE':
        try:
            habit = Habit.objects.get(id=habit_id)
            habit.delete()
            return JsonResponse({'message': 'Habit deleted'})
        except Habit.DoesNotExist:
            return JsonResponse({'error': 'Habit not found'}, status=404)

@csrf_exempt
def habit_log(request, habit_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        habit = Habit.objects.get(id=habit_id)
        
        log, created = HabitLog.objects.get_or_create(
            habit=habit,
            date=date.today(),
            defaults={
                'completed': data.get('completed', False),
                'notes': data.get('notes', '')
            }
        )
        
        if not created:
            log.completed = data.get('completed', False)
            log.notes = data.get('notes', '')
            log.save()
            
        return JsonResponse({'message': 'Log updated'})