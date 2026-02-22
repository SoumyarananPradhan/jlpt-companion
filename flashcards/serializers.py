from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Deck, Card, UserProgress

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'front_text', 'reading', 'meaning', 'example_sentence']

class UserProgressSerializer(serializers.ModelSerializer):
    card = CardSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = ['id', 'card', 'next_review_date']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # create_user automatically hashes the password for security
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user