from django.urls import reverse
from rest_framework import status
from datetime import datetime, timedelta
from sales_api.tests.test_api_base import APIBaseTest
from sales_api.models.collection import Collection
from sales_api.models.card import Card
from sales_api.models.order import Order
from sales_api.models.order_item import OrderItem

from django.contrib.auth import get_user_model

User = get_user_model()


class DashboardKPIsAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com',
                                              password='testpassword')

        self.collection1 = Collection.objects.create(name='Test Collection 1', status='PUBLIC',
                                                     issuer_name='Test Issuer 1', category='GAMING')
        self.card1 = Card.objects.create(name='Test Card 1', collection=self.collection1, rarity='COMMON')
        self.card2 = Card.objects.create(name='Test Card 2', collection=self.collection1, rarity='RARE')

        self.order1 = Order.objects.create(user=self.user, status='COMPLETED', order_value=70.00,
                                           order_date=datetime.now() - timedelta(days=60))
        # Added price_at_purchase
        OrderItem.objects.create(order=self.order1, card=self.card1, quantity=2, price_at_purchase=10.00)

        self.order2 = Order.objects.create(user=self.user2, status='COMPLETED', order_value=300.00,
                                           order_date=datetime.now() - timedelta(days=30))
        # Added price_at_purchase
        OrderItem.objects.create(order=self.order2, card=self.card2, quantity=1, price_at_purchase=20.00)

        # Recent order
        self.order3 = Order.objects.create(user=self.user, status='COMPLETED', order_value=105.00,
                                           order_date=datetime.now() - timedelta(days=5))
        # Added price_at_purchase
        OrderItem.objects.create(order=self.order3, card=self.card1, quantity=1, price_at_purchase=30.00)

    def test_kpis_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('dashboard-kpis'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertIn('avg_order_value', data)
        self.assertIn('total_created_cards', data)
        self.assertIn('total_collections_created', data)
        self.assertIn('total_users_account', data)
        self.assertIn('sales_overtime', data)
        self.assertIn('latest_orders', data)
        self.assertIn('metrics_growth', data)

    def test_kpis_unauthenticated(self):
        response = self.client.get(reverse('dashboard-kpis'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)