from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
from django.utils import timezone
from datetime import timedelta
from sales_api.models import Collection, Card, Order, OrderItem

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')
        self.assertEqual(admin_user.username, 'admin')
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.check_password('adminpassword'))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)
    
    def test_email_unique(self):
        User.objects.create_user(username='user1', email='duplicate@example.com', password='password123')
        with self.assertRaises(Exception):
            User.objects.create_user(username='user2', email='duplicate@example.com', password='password456')

class CollectionModelTests(TestCase):
    def test_create_collection(self):
        collection = Collection.objects.create(
            name='Summer Collection', 
            status='PENDING', 
            expected_release_date='2025-07-30',
            issuer_name='Test Issuer',
            category='GAMING'
        )
        self.assertEqual(collection.name, 'Summer Collection')
        self.assertEqual(collection.status, 'PENDING')
        self.assertEqual(collection.issuer_name, 'Test Issuer')
        self.assertEqual(collection.category, 'GAMING')
        self.assertIsNotNone(collection.created_at)
        self.assertIsNotNone(collection.updated_at)
    
    def test_collection_name_unique(self):
        Collection.objects.create(name='Unique Collection', status='PENDING')
        with self.assertRaises(Exception):
            Collection.objects.create(name='Unique Collection', status='ISSUED')
    
    def test_collection_status_choices(self):
        collection = Collection.objects.create(name='Status Test', status='PENDING')
        self.assertEqual(collection.get_status_display(), 'Pending')
        
        collection.status = 'IN_PRODUCTION'
        collection.save()
        self.assertEqual(collection.get_status_display(), 'In Production')
        
        collection.status = 'ISSUED'
        collection.save()
        self.assertEqual(collection.get_status_display(), 'Issued')
        
        collection.status = 'PUBLIC'
        collection.save()
        self.assertEqual(collection.get_status_display(), 'Public')
    
    def test_collection_category_choices(self):
        collection = Collection.objects.create(name='Category Test', category='ESPORT')
        self.assertEqual(collection.get_category_display(), 'Esport')
        
        collection.category = 'GAMING'
        collection.save()
        self.assertEqual(collection.get_category_display(), 'Gaming')
        
        collection.category = 'ART'
        collection.save()
        self.assertEqual(collection.get_category_display(), 'Art')
        
        collection.category = 'SPORTS'
        collection.save()
        self.assertEqual(collection.get_category_display(), 'Sports')
        
        collection.category = 'OTHER'
        collection.save()
        self.assertEqual(collection.get_category_display(), 'Other')

class CardModelTests(TestCase):
    def setUp(self):
        self.collection = Collection.objects.create(name='Test Collection', status='ISSUED')

    def test_create_card(self):
        card = Card.objects.create(
            collection=self.collection, 
            name='Fire Elemental', 
            category='COMMON', 
            rarity='BRONZE'
        )
        self.assertEqual(card.name, 'Fire Elemental')
        self.assertEqual(card.collection.name, 'Test Collection')
        self.assertEqual(card.category, 'COMMON')
        self.assertEqual(card.rarity, 'BRONZE')
        self.assertEqual(card.get_category_display(), 'Common')
        self.assertEqual(card.get_rarity_display(), 'Bronze')

    def test_card_unique_together(self):
        Card.objects.create(collection=self.collection, name='Duplicate Card', category='COMMON')
        with self.assertRaises(Exception):
            Card.objects.create(collection=self.collection, name='Duplicate Card', category='RARE')
    
    def test_card_category_choices(self):
        card = Card.objects.create(collection=self.collection, name='Category Test', category='COMMON')
        self.assertEqual(card.get_category_display(), 'Common')
        
        card.category = 'RARE'
        card.save()
        self.assertEqual(card.get_category_display(), 'Rare')
        
        card.category = 'EPIC'
        card.save()
        self.assertEqual(card.get_category_display(), 'Epic')
        
        card.category = 'LEGENDARY'
        card.save()
        self.assertEqual(card.get_category_display(), 'Legendary')
    
    def test_card_rarity_choices(self):
        card = Card.objects.create(collection=self.collection, name='Rarity Test', rarity='BRONZE')
        self.assertEqual(card.get_rarity_display(), 'Bronze')
        
        card.rarity = 'SILVER'
        card.save()
        self.assertEqual(card.get_rarity_display(), 'Silver')
        
        card.rarity = 'GOLD'
        card.save()
        self.assertEqual(card.get_rarity_display(), 'Gold')
        
        card.rarity = 'PLATINUM'
        card.save()
        self.assertEqual(card.get_rarity_display(), 'Platinum')

class OrderModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='orderuser', password='password123')
        self.collection = Collection.objects.create(name='Order Test Collection', status='ISSUED')
        self.card = Card.objects.create(collection=self.collection, name='Order Test Card', category='COMMON')

    def test_create_order(self):
        order = Order.objects.create(
            user=self.user, 
            order_value=150.75, 
            status='PROCESSING'
        )
        self.assertEqual(order.user.username, 'orderuser')
        self.assertEqual(float(order.order_value), 150.75)
        self.assertEqual(order.status, 'PROCESSING')
        self.assertEqual(order.get_status_display(), 'Processing')
        self.assertIsNotNone(order.order_date)
    
    def test_order_status_choices(self):
        order = Order.objects.create(user=self.user, order_value=100.00, status='PROCESSING')
        self.assertEqual(order.get_status_display(), 'Processing')
        
        order.status = 'COMPLETED'
        order.save()
        self.assertEqual(order.get_status_display(), 'Completed')
        
        order.status = 'CANCELLED'
        order.save()
        self.assertEqual(order.get_status_display(), 'Cancelled')

class OrderItemModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='orderitemuser', password='password123')
        self.collection = Collection.objects.create(name='OrderItem Test Collection', status='ISSUED')
        self.card = Card.objects.create(collection=self.collection, name='OrderItem Test Card', category='COMMON')
        self.order = Order.objects.create(user=self.user, order_value=200.00, status='PROCESSING')

    def test_create_order_item(self):
        order_item = OrderItem.objects.create(
            order=self.order,
            card=self.card,
            copy_number='123456',
            quantity=2,
            price_at_purchase=25.50
        )
        self.assertEqual(order_item.order.id, self.order.id)
        self.assertEqual(order_item.card.id, self.card.id)
        self.assertEqual(order_item.copy_number, '123456')
        self.assertEqual(order_item.quantity, 2)
        self.assertEqual(float(order_item.price_at_purchase), 25.50)
    
    def test_order_item_unique_together(self):
        OrderItem.objects.create(
            order=self.order,
            card=self.card,
            copy_number='UNIQUE123',
            quantity=1,
            price_at_purchase=10.00
        )
        with self.assertRaises(Exception):
            OrderItem.objects.create(
                order=self.order,
                card=self.card,
                copy_number='UNIQUE123',  # Same copy number for same order and card
                quantity=3,
                price_at_purchase=15.00
            )
    
    def test_order_item_different_copy_numbers(self):
        # Should be able to create multiple order items for same order and card with different copy numbers
        OrderItem.objects.create(
            order=self.order,
            card=self.card,
            copy_number='COPY1',
            quantity=1,
            price_at_purchase=10.00
        )
        # This should not raise an exception
        OrderItem.objects.create(
            order=self.order,
            card=self.card,
            copy_number='COPY2',  # Different copy number
            quantity=1,
            price_at_purchase=10.00
        )
        self.assertEqual(OrderItem.objects.filter(order=self.order, card=self.card).count(), 2)