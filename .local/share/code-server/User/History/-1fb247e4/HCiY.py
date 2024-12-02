@csrf_exempt
def habit_log(request, habit_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            habit = Habit.objects.get(id=habit_id)
            
            # Use today's date
            from datetime import date
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