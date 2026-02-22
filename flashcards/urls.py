from django.urls import path
from .views import DeckListView, StudySessionView, ReviewCardView, RegisterView, UserStatsView

urlpatterns = [
    path('decks/', DeckListView.as_view(), name='deck-list'),
    path('study/<int:deck_id>/', StudySessionView.as_view(), name='study-session'),
    path('review/', ReviewCardView.as_view(), name='review-card'),
    path('register/', RegisterView.as_view(), name='register'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
]