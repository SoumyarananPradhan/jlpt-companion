from django.contrib import admin
from .models import Deck, Card, UserProgress

@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ('name', 'level')
    search_fields = ('name',)

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('front_text', 'reading', 'meaning', 'deck')
    list_filter = ('deck',)
    search_fields = ('front_text', 'meaning')

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'card', 'next_review_date', 'interval', 'ease_factor')
    list_filter = ('next_review_date', 'user')