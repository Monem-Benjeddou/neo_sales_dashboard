# sales_api/tests.py

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from .models import Collection, Card, Order

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')
        self.assertEqual(admin_user.username, 'admin')
        self.assertTrue(admin_user.check_password('adminpassword'))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

class CollectionModelTests(TestCase):
    def test_create_collection(self):
        collection = Collection.objects.create(name='Summer Collection', status='PENDING', expected_release_date='2025-07-30')
        self.assertEqual(collection.name, 'Summer Collection')
        self.assertEqual(collection.status, 'PENDING')

class CardModelTests(TestCase):
    def setUp(self):
        self.collection = Collection.objects.create(name='Test Collection', status='ISSUED')

    def test_create_card(self):
        card = Card.objects.create(collection=self.collection, name='Fire Elemental', category='COMMON', rarity='BRONZE')
        self.assertEqual(card.name, 'Fire Elemental')
        self.assertEqual(card.collection.name, 'Test Collection')
        self.assertEqual(card.category, 'COMMON')

    def test_card_unique_together(self):
        Card.objects.create(collection=self.collection, name='Duplicate Card', category='COMMON')
        with self.assertRaises(Exception): # IntegrityError is expected
            Card.objects.create(collection=self.collection, name='Duplicate Card', category='RARE')

class OrderModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='orderuser', password='password123')

    def test_create_order(self):
        order = Order.objects.create(user=self.user, order_value=150.75, status='PROCESSING')
        self.assertEqual(order.user.username, 'orderuser')
        self.assertEqual(float(order.order_value), 150.75)
        self.assertEqual(order.status, 'PROCESSING')

class APIBaseTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuserapi', email='testapi@example.com', password='testpassword')
        self.admin_user = User.objects.create_superuser(username='adminapi', email='adminapi@example.com', password='adminpassword')

    def get_auth_headers(self, user):
        response = self.client.post(reverse('token_obtain_pair'), {'username': user.username, 'password': 'testpassword' if user == self.user else 'adminpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        return {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}

class UserAPITests(APIBaseTest):
    def test_list_users_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('user-list'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2) # testuserapi and adminapi

    def test_list_users_unauthenticated(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK) # Read-only allowed by IsAuthenticatedUser

    def test_create_user_authenticated(self):
        headers = self.get_auth_headers(self.admin_user)
        data = {'username': 'newuser', 'email': 'new@example.com', 'password': 'newpassword'}
        response = self.client.post(reverse('user-list'), data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3) # Existing 2 + new 1

    def test_create_user_unauthenticated(self):
        data = {'username': 'anonuser', 'email': 'anon@example.com', 'password': 'anonpassword'}
        response = self.client.post(reverse('user-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class CollectionAPITests(APIBaseTest):
    def test_list_collections(self):
        Collection.objects.create(name='Collection A')
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collection-list'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_collection_authenticated(self):
        headers = self.get_auth_headers(self.user)
        data = {'name': 'New Collection', 'status': 'PENDING'}
        response = self.client.post(reverse('collection-list'), data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Collection.objects.count(), 1)

    def test_create_collection_unauthenticated(self):
        data = {'name': 'Unauthorized Collection', 'status': 'PENDING'}
        response = self.client.post(reverse('collection-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class DashboardKPIsAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.collection1 = Collection.objects.create(name='Col1', status='ISSUED')
        self.collection2 = Collection.objects.create(name='Col2', status='PENDING')
        self.card1 = Card.objects.create(collection=self.collection1, name='Card A', category='COMMON')
        self.card2 = Card.objects.create(collection=self.collection1, name='Card B', category='RARE')
        self.order1 = Order.objects.create(user=self.user, order_value=100.00, status='COMPLETED')
        self.order2 = Order.objects.create(user=self.user, order_value=50.00, status='PROCESSING')
        self.order3 = Order.objects.create(user=self.admin_user, order_value=200.00, status='COMPLETED')

    def test_kpis_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('dashboard-kpis'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('avg_order_value', response.data)
        self.assertIn('total_created_cards', response.data)
        self.assertIn('total_collections_created', response.data)
        self.assertIn('total_users_account', response.data)
        self.assertIn('sales_overtime', response.data)
        self.assertIn('latest_orders', response.data)

        self.assertAlmostEqual(response.data['avg_order_value'], 116.66, places=2) # (100+50+200)/3
        self.assertEqual(response.data['total_created_cards'], 2)
        self.assertEqual(response.data['total_collections_created'], 2)
        self.assertEqual(response.data['total_users_account'], 2) # testuserapi and adminapi

    def test_kpis_unauthenticated(self):
        response = self.client.get(reverse('dashboard-kpis'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)