from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Deck, Card, UserProgress
from .serializers import DeckSerializer, CardSerializer, RegisterSerializer
from .services import calculate_sm2
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User


class DeckListView(APIView):
    # We leave this open so anyone visiting the app can see the available courses
    def get(self, request):
        decks = Deck.objects.all()
        serializer = DeckSerializer(decks, many=True)
        return Response(serializer.data)

class StudySessionView(APIView):
    # This locks the endpoint so only users with a valid JWT token can access it
    permission_classes = [IsAuthenticated]

    def get(self, request, deck_id):
        print(f"--- API CALLED: Fetching session for Deck ID {deck_id} ---")
        
        # Django REST Framework automatically attaches the user from the JWT token
        user = request.user 
        
        # 1. Check if the deck actually has cards in the database
        total_deck_cards = Card.objects.filter(deck_id=deck_id).count()
        print(f"Total cards existing in this deck: {total_deck_cards}")
        
        if total_deck_cards == 0:
            return Response([]) 

        # 2. Fetch cards that are DUE for review today
        due_progress = UserProgress.objects.filter(
            user=user, 
            card__deck_id=deck_id,
            next_review_date__lte=timezone.now()
        )
        due_cards = [progress.card for progress in due_progress]
        print(f"Cards due for review: {len(due_cards)}")
        
        # 3. If we have no due cards, fetch BRAND NEW cards the user hasn't seen yet
        if not due_cards:
            seen_card_ids = UserProgress.objects.filter(
                user=user, 
                card__deck_id=deck_id
            ).values_list('card_id', flat=True)
            
            new_cards = Card.objects.filter(deck_id=deck_id).exclude(id__in=seen_card_ids)[:20]
            due_cards = list(new_cards)
            print(f"Fetched new unseen cards: {len(due_cards)}")
            
        serializer = CardSerializer(due_cards, many=True)
        return Response(serializer.data)

class ReviewCardView(APIView):
    # Locks the grading endpoint
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user 
        card_id = request.data.get('card_id')
        quality = request.data.get('quality') 
        
        try:
            progress, created = UserProgress.objects.get_or_create(
                user=user, 
                card_id=card_id
            )
            
            new_stats = calculate_sm2(
                quality=int(quality),
                repetitions=progress.repetitions,
                previous_interval=progress.interval,
                previous_ease_factor=progress.ease_factor
            )
            
            progress.repetitions = new_stats['repetitions']
            progress.interval = new_stats['interval']
            progress.ease_factor = new_stats['ease_factor']
            progress.next_review_date = new_stats['next_review_date']
            progress.save()
            
            return Response({"status": "success", "next_review": progress.next_review_date})
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # Anyone can register
    serializer_class = RegisterSerializer

class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        # 1. Total unique cards the user has reviewed at least once
        total_studied = UserProgress.objects.filter(user=user).count()
        
        # 2. Cards due right now
        due_cards = UserProgress.objects.filter(
            user=user, 
            next_review_date__lte=now
        ).count()

        # 3. Mastered cards (Interval is 21 days or longer)
        mastered_cards = UserProgress.objects.filter(
            user=user,
            interval__gte=21
        ).count()

        return Response({
            "total_studied": total_studied,
            "due_cards": due_cards,
            "mastered_cards": mastered_cards,
        })