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
                'amount_per_day': habit.amount_per_day,
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
            amount_per_day=data.get('amount_per_day', 1),
            target_days_per_week=data['target_days_per_week']
        )
        return JsonResponse({
            'id': habit.id,
            'name': habit.name,
            'amount_per_day': habit.amount_per_day,
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
        try:
            data = json.loads(request.body)
            habit = Habit.objects.get(id=habit_id)
            today = date.today()
            
            log, created = HabitLog.objects.get_or_create(
                habit=habit,
                date=today,
                defaults={
                    'completed': data.get('completed', False),
                    'notes': data.get('notes', '')
                }
            )
            
            if not created:
                log.completed = data.get('completed', False)
                log.notes = data.get('notes', '')
                log.save()
            
            return JsonResponse({
                'message': 'Log updated',
                'completed': log.completed,
                'date': str(log.date)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'GET':
        try:
            habit = Habit.objects.get(id=habit_id)
            logs = HabitLog.objects.filter(habit=habit).order_by('-date')
            logs_data = [{
                'id': log.id,
                'date': str(log.date),
                'completed': log.completed,
                'notes': log.notes
            } for log in logs]
            return JsonResponse({'logs': logs_data})
        except Habit.DoesNotExist:
            return JsonResponse({'error': 'Habit not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)