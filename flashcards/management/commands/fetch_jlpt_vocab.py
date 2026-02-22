import requests
import time
from django.core.management.base import BaseCommand
from flashcards.models import Deck, Card

class Command(BaseCommand):
    help = 'Fetches JLPT N5, N4, and N3 vocabulary from the Jisho API and populates the database'

    def handle(self, *args, **kwargs):
        # The JLPT levels we want to fetch
        levels = ['n5', 'n4', 'n3']
        
        # How many pages of 20 words to fetch per level (e.g., 5 pages = 100 words per deck)
        # You can increase this, but keep it reasonable to avoid overloading the API
        pages_to_fetch = 5 

        for level in levels:
            self.stdout.write(f"\n--- Processing JLPT {level.upper()} ---")
            
            # 1. Create or fetch the specific Deck for this level
            deck, created = Deck.objects.get_or_create(
                name=f"JLPT {level.upper()} Core Vocabulary",
                level=level.upper(),
                defaults={'description': f"Auto-imported {level.upper()} vocabulary from Jisho."}
            )

            total_added = 0

            # 2. Loop through multiple pages to get more than just the first 20 words
            for page in range(1, pages_to_fetch + 1):
                self.stdout.write(f"Fetching page {page} for {level.upper()}...")
                
                # The %23 is the URL-encoded hashtag symbol (#jlpt-n5)
                url = f"https://jisho.org/api/v1/search/words?keyword=%23jlpt-{level}&page={page}"
                response = requests.get(url)
                
                if response.status_code != 200:
                    self.stdout.write(self.style.ERROR(f"Failed to fetch page {page}. Skipping..."))
                    continue
                    
                data = response.json().get('data', [])
                
                # If the API returns an empty array, we've reached the end of the vocabulary list
                if not data:
                    self.stdout.write("No more words found. Moving to next level.")
                    break
                
                # 3. Parse the JSON and map it to our Django Models
                for item in data:
                    try:
                        japanese_info = item['japanese'][0]
                        kanji_or_kana = japanese_info.get('word', japanese_info.get('reading', ''))
                        reading = japanese_info.get('reading', '')
                        
                        english_senses = item['senses'][0]['english_definitions']
                        meaning = ", ".join(english_senses) 
                        
                        # 4. Save to Database
                        card, card_created = Card.objects.get_or_create(
                            deck=deck,
                            front_text=kanji_or_kana,
                            defaults={
                                'reading': reading,
                                'meaning': meaning,
                                'example_sentence': '' 
                            }
                        )
                        
                        if card_created:
                            total_added += 1
                            
                    except (KeyError, IndexError):
                        continue
                
                # Sleep briefly between page requests to be polite to Jisho's servers
                time.sleep(0.5)
                
            self.stdout.write(self.style.SUCCESS(f"Success! Added {total_added} cards to the {level.upper()} deck."))