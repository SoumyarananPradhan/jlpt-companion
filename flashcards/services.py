from datetime import timedelta
from django.utils import timezone

def calculate_sm2(quality, repetitions, previous_interval, previous_ease_factor):
    """
    Calculates the next review date based on the SM-2 algorithm.
    quality: 0-5 (0 = blackout, 5 = perfect recall)
    """
    if quality >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(previous_interval * previous_ease_factor)
        
        repetitions += 1
        ease_factor = previous_ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    else:
        repetitions = 0
        interval = 1
        ease_factor = previous_ease_factor # EF doesn't decrease on failure in basic SM-2

    # Ensure ease factor doesn't drop below a minimum threshold
    ease_factor = max(1.3, ease_factor)
    
    next_review_date = timezone.now() + timedelta(days=interval)
    
    return {
        'repetitions': repetitions,
        'interval': interval,
        'ease_factor': ease_factor,
        'next_review_date': next_review_date
    }