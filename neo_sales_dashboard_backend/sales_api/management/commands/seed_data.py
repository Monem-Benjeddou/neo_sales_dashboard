
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from datetime import date, timedelta
import random
from django.utils import timezone

from sales_api.models import Collection, Card, Order

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with initial data for testing and development.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        self.stdout.write('Clearing existing data...')
        Order.objects.all().delete()
        Card.objects.all().delete()
        Collection.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()  # Keep superuser if exists

        try:
            with transaction.atomic():
                self.stdout.write('Creating users...')
                users = []
                if not User.objects.filter(username='john.doe').exists():
                    users.append(
                        User.objects.create_user(username='john.doe', email='john@example.com', password='password123'))
                if not User.objects.filter(username='jane.smith').exists():
                    users.append(User.objects.create_user(username='jane.smith', email='jane@example.com',
                                                          password='password123'))
                if not User.objects.filter(username='mike.williams').exists():
                    users.append(User.objects.create_user(username='mike.williams', email='mike@example.com',
                                                          password='password123'))

                if not users:
                    users = list(User.objects.filter(is_superuser=False))
                    if not users:
                        self.stdout.write(self.style.WARNING(
                            'No non-superuser users found or created. Please create some manually or adjust seeding logic.'))
                        return

                self.stdout.write('Creating collections...')
                collections_data = [
                    {'name': 'Team Falcons #1', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2025, 7, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': 'Falcons 5', 'status': 'PENDING', 'expected_release_date': date(2025, 8, 15),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                    {'name': '0xabc123...789 A', 'status': 'PENDING', 'expected_release_date': date(2025, 9, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': '0xabc123...789 B', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2025, 10, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                    {'name': '0xabc123...789 C', 'status': 'PENDING', 'expected_release_date': date(2025, 11, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                    {'name': '0xabc123...789 D', 'status': 'PUBLIC', 'expected_release_date': date(2025, 12, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                    {'name': '0xabc123...789 E', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2026, 1, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': '0xabc123...789 F', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2026, 2, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': '0xabc123...789 G', 'status': 'PUBLIC', 'expected_release_date': date(2026, 3, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': '0xabc123...789 H', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2026, 4, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                ]
                collections = [Collection.objects.create(**data) for data in collections_data]

                self.stdout.write('Creating cards...')
                cards_created = []
                card_categories = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY']
                card_rarities = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']

                card_counts_per_collection = [5, 3, 7, 8, 12, 1, 11, 7, 8,
                                              3]

                for i, collection in enumerate(collections):
                    num_cards = card_counts_per_collection[i] if i < len(
                        card_counts_per_collection) else random.randint(1, 12)

                    for j in range(num_cards):
                        card_name = f"Design {j + 1} of {collection.name}"
                        card_category = random.choice(card_categories)
                        card_rarity = random.choice(card_rarities)
                        cards_created.append(Card.objects.create(
                            collection=collection,
                            name=card_name,
                            category=card_category,
                            rarity=card_rarity
                        ))

                self.stdout.write('Creating orders...')
                order_statuses = ['PROCESSING', 'COMPLETED', 'CANCELLED']

                specific_user = User.objects.get(username='john.doe')
                Order.objects.create(user=specific_user, order_value=134.00, status='COMPLETED',
                                     order_date=timezone.now() - timedelta(days=3, hours=1,
                                                                           minutes=37))  # Jan 12, 12:23 pm
                Order.objects.create(user=specific_user, order_value=210.50, status='PROCESSING',
                                     order_date=timezone.now() - timedelta(days=2, hours=0,
                                                                           minutes=15))  # Jan 13, 01:45 pm
                Order.objects.create(user=specific_user, order_value=99.00, status='COMPLETED',
                                     order_date=timezone.now() - timedelta(days=1, hours=8,
                                                                           minutes=0))  # Jan 14, 09:00 am
                Order.objects.create(user=specific_user, order_value=350.00, status='COMPLETED',
                                     order_date=timezone.now() - timedelta(
                                         hours=10))  # Jan 15, 03:00 pm (relative to now)

                for _ in range(200):
                    user = random.choice(users)
                    order_value = round(random.uniform(25.00, 1000.00), 2)  # Wider range for values
                    status_choice = random.choice(order_statuses)

                    days_ago = random.randint(0, 365)
                    hours_ago = random.randint(0, 23)
                    minutes_ago = random.randint(0, 59)
                    order_date = timezone.now() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)

                    Order.objects.create(
                        user=user,
                        order_value=order_value,
                        status=status_choice,
                        order_date=order_date
                    )

            self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Database seeding failed: {e}'))
            self.stdout.write(self.style.WARNING('Transaction rolled back.'))