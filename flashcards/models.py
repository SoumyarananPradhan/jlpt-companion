from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Deck(models.Model):
    name = models.CharField(max_length=100) # e.g., "Kanji Master", "Core Vocabulary"
    description = models.TextField(blank=True)
    level = models.CharField(max_length=10) # e.g., "N5", "N4", "N3"

    def __str__(self):
        return f"{self.level} - {self.name}"

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='cards')
    front_text = models.CharField(max_length=255) # The Kanji or Vocabulary word
    reading = models.CharField(max_length=255, blank=True) # Furigana / Hiragana
    meaning = models.CharField(max_length=255) # English translation
    example_sentence = models.TextField(blank=True)

    def __str__(self):
        return self.front_text

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_progress')
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    
    # Spaced Repetition (SM-2) Engine Fields
    ease_factor = models.FloatField(default=2.5)
    interval = models.IntegerField(default=0) # Measured in days
    repetitions = models.IntegerField(default=0) # Number of consecutive correct answers
    next_review_date = models.DateTimeField(default=timezone.now)

    class Meta:
        # Ensures a user only has one progress record per individual flashcard
        unique_together = ('user', 'card') 

    def __str__(self):
        return f"{self.user.username}'s progress on: {self.card.front_text}"