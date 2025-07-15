from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from datetime import date, timedelta
import random
from django.utils import timezone
# No need for 'uuid' import here if all IDs are auto-generated integers

from sales_api.models import Collection, Card, Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with initial data for testing and development.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        self.stdout.write('Clearing existing data...')
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Card.objects.all().delete()
        Collection.objects.all().delete()
        User.objects.filter(is_superuser=False).delete() # Keep this for existing non-superusers

        try:
            with transaction.atomic():
                self.stdout.write('Creating users...')
                users = []

                # For get_or_create, first create/get, then set password
                john_doe, created = User.objects.get_or_create(username='john.doe', defaults={'email': 'john@example.com'})
                if created or not john_doe.has_usable_password(): # Check if password needs setting/updating
                    john_doe.set_password('password123')
                    john_doe.save()

                jane_smith, created = User.objects.get_or_create(username='jane.smith', defaults={'email': 'jane@example.com'})
                if created or not jane_smith.has_usable_password():
                    jane_smith.set_password('password123')
                    jane_smith.save()

                mike_williams, created = User.objects.get_or_create(username='mike.williams', defaults={'email': 'mike@example.com'})
                if created or not mike_williams.has_usable_password():
                    mike_williams.set_password('password123')
                    mike_williams.save()

                users.extend([john_doe, jane_smith, mike_williams])

                for i in range(5):
                    username = f"user_{i}_{random.randint(1000, 9999)}"
                    email = f"user_{i}_{random.randint(1000, 9999)}@example.com"
                    if not User.objects.filter(username=username).exists():
                        # create_user automatically hashes the password
                        users.append(User.objects.create_user(username=username, email=email, password='password123'))

                self.stdout.write('Creating collections...')
                collections_data = [
                    {'name': 'Team Falcons #1', 'status': 'IN_PRODUCTION', 'expected_release_date': date(2025, 7, 1),
                     'issuer_name': 'MEDKSA001', 'category': 'ESPORT'},
                    {'name': 'Falcons 5', 'status': 'PENDING', 'expected_release_date': date(2025, 8, 15),
                     'issuer_name': 'MEDKSA001', 'category': 'GAMING'},
                    {'name': 'Pixel Pioneers', 'status': 'PUBLIC', 'expected_release_date': date(2025, 6, 20),
                     'issuer_name': 'ARTISANCO', 'category': 'ART'},
                    {'name': 'Crypto Knights', 'status': 'ISSUED', 'expected_release_date': date(2024, 11, 1),
                     'issuer_name': 'DIGITALFORGE', 'category': 'GAMING'},
                    {'name': 'Sports Legends 2025', 'status': 'IN_PRODUCTION',
                     'expected_release_date': date(2025, 9, 10),
                     'issuer_name': 'SCOREBOARD', 'category': 'SPORTS'},
                    {'name': 'Sports Legends 2024', 'status': 'IN_PRODUCTION',
                     'expected_release_date': date(2025, 9, 10),
                     'issuer_name': 'SCOREBOARD', 'category': 'SPORTS'},
                ]
                collections = [Collection.objects.create(**data) for data in collections_data]

                self.stdout.write('Creating cards...')
                cards_created = []
                card_categories = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY']
                card_rarities = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']

                falcon_collections = [c for c in collections if 'Falcon' in c.name]

                if falcon_collections:
                    falcon_collection_1 = next((c for c in falcon_collections if c.name == 'Team Falcons #1'), None)
                    falcon_collection_2 = next((c for c in falcon_collections if c.name == 'Falcons 5'), None)

                    if falcon_collection_1:
                        cards_created.append(
                            Card.objects.create(collection=falcon_collection_1, name='Falcon1', category='LEGENDARY',
                                                rarity='PLATINUM'))
                        cards_created.append(
                            Card.objects.create(collection=falcon_collection_1, name='Falcon2', category='EPIC',
                                                rarity='GOLD'))
                        cards_created.append(
                            Card.objects.create(collection=falcon_collection_1, name='Falcon3', category='RARE',
                                                rarity='SILVER'))
                    if falcon_collection_2:
                        cards_created.append(Card.objects.create(collection=falcon_collection_2, name='Dark Falcon',
                                                                 category='LEGENDARY', rarity='PLATINUM'))
                        cards_created.append(
                            Card.objects.create(collection=falcon_collection_2, name='Desert Falcon', category='RARE',
                                                rarity='BRONZE'))

                for collection in collections:
                    num_cards = random.randint(3, 10)
                    for j in range(num_cards):
                        card_name = f"Card {random.randint(1, 100)} - {collection.name.split(' ')[0]}"
                        card_category = random.choice(card_categories)
                        card_rarity = random.choice(card_rarities)

                        if not Card.objects.filter(collection=collection, name=card_name).exists():
                            cards_created.append(Card.objects.create(
                                collection=collection,
                                name=card_name,
                                category=card_category,
                                rarity=card_rarity
                            ))

                if not cards_created:
                    self.stdout.write(self.style.ERROR("No cards were created. Seeding OrderItems will fail."))
                    return

                all_cards = list(Card.objects.all())
                if not all_cards:
                    self.stdout.write(
                        self.style.ERROR("No cards found to create OrderItems. Please check card seeding logic."))
                    return

                self.stdout.write('Creating orders and order items...')
                order_statuses = ['PROCESSING', 'COMPLETED', 'CANCELLED']

                # Orders will span from January 1, 2025, to current date
                start_date = timezone.datetime(2025, 1, 1, 0, 0, 0, tzinfo=timezone.get_current_timezone())
                end_date = timezone.now()
                time_difference = end_date - start_date
                total_seconds = int(time_difference.total_seconds())

                # Specific Orders to match your dashboard example
                john_specific_date = timezone.datetime(2025, 1, 12, 12, 23, tzinfo=timezone.get_current_timezone())

                order1 = Order.objects.create(
                    user=john_doe,
                    order_value=0,
                    status='COMPLETED',
                    order_date=john_specific_date
                )
                total_order1_value = 0

                # Ensure these cards exist or handle the case where they might not
                falcon1_card = Card.objects.filter(name='Falcon1').first()
                if not falcon1_card:
                    self.stdout.write(self.style.WARNING("Falcon1 card not found. Using a random card for specific order."))
                    falcon1_card = random.choice(all_cards)
                falcon2_card = Card.objects.filter(name='Falcon2').first()
                if not falcon2_card:
                    self.stdout.write(self.style.WARNING("Falcon2 card not found. Using a random card for specific order."))
                    falcon2_card = random.choice(all_cards)


                items_to_add = [
                    {'card': falcon1_card, 'copy_number': '005/100', 'price': 134.00},
                    {'card': falcon2_card, 'copy_number': '010/100', 'price': 134.00},
                    {'card': falcon1_card, 'copy_number': '007/100', 'price': 134.00},
                    {'card': falcon1_card, 'copy_number': '050/100', 'price': 134.00},
                    {'card': falcon1_card, 'copy_number': '099/100', 'price': 134.00},
                ]

                for item_data in items_to_add:
                    # Check if card is None before creating OrderItem
                    if item_data['card'] is None:
                        self.stdout.write(self.style.ERROR(f"Skipping OrderItem creation due to missing card for item: {item_data.get('copy_number', 'N/A')}"))
                        continue

                    OrderItem.objects.create(
                        order=order1,
                        card=item_data['card'],
                        copy_number=item_data['copy_number'],
                        quantity=1,
                        price_at_purchase=item_data['price']
                    )
                    total_order1_value += item_data['price']
                order1.order_value = total_order1_value
                order1.save()
                self.stdout.write(f"Created specific order #{order1.id} with multiple items from Jan 12, 2025.")

                # Create 300 random orders, distributed across the current year
                for _ in range(300):
                    user = random.choice(users)
                    status_choice = random.choice(order_statuses)

                    random_seconds = random.randint(0, total_seconds)
                    order_date = start_date + timedelta(seconds=random_seconds)

                    new_order = Order.objects.create(
                        user=user,
                        order_value=0,
                        status=status_choice,
                        order_date=order_date
                    )

                    num_items_in_order = random.randint(1, 4)
                    current_order_total = 0

                    for _ in range(num_items_in_order):
                        card_chosen = random.choice(all_cards)

                        total_copies = random.choice([50, 100, 250, 500])
                        copy_num = f"{random.randint(1, total_copies):03d}/{total_copies}"

                        item_price = round(random.uniform(10.00, 500.00), 2)

                        OrderItem.objects.create(
                            order=new_order,
                            card=card_chosen,
                            copy_number=copy_num,
                            quantity=1,
                            price_at_purchase=item_price
                        )
                        current_order_total += item_price

                    new_order.order_value = current_order_total
                    new_order.save()

            self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Database seeding failed: {e}'))
            self.stdout.write(self.style.WARNING('Transaction rolled back.'))