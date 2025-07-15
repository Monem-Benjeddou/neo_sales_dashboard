from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta, timezone as dt_timezone
from unittest.mock import patch

from sales_api.models import Collection, Card, Order, OrderItem
from sales_api.services.dashboard_service import DashboardService
from sales_api.services.collection_service import CollectionService
from sales_api.services.card_service import CardService
from sales_api.services.order_service import OrderService
from sales_api.services.user_service import UserService

User = get_user_model()


class DashboardServiceTests(TestCase):
    def setUp(self):
        self.dashboard_service = DashboardService()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password123')
        self.collection1 = Collection.objects.create(name='Collection 1', status='ISSUED')
        self.card1 = Card.objects.create(collection=self.collection1, name='Card 1', category='COMMON')
        self.order1 = Order.objects.create(user=self.user1, order_value=100.00, status='COMPLETED')
        OrderItem.objects.create(order=self.order1, card=self.card1, quantity=1, price_at_purchase=100.00)

    def test_calculate_growth_positive(self):
        growth = self.dashboard_service._calculate_growth(100, 50)
        self.assertEqual(growth, '+100.00%')

    def test_get_kpis_data_basic(self):
        with patch.object(self.dashboard_service.user_service, 'get_total_users_count', return_value=1), \
                patch.object(self.dashboard_service.user_service, 'get_users_count_for_month', return_value=1), \
                patch.object(self.dashboard_service.collection_service, 'get_total_collections_count', return_value=1), \
                patch.object(self.dashboard_service.collection_service, 'get_collections_count_for_month',
                             return_value=1), \
                patch.object(self.dashboard_service.card_service, 'get_total_cards_count', return_value=1), \
                patch.object(self.dashboard_service.card_service, 'get_cards_count_for_month', return_value=1), \
                patch.object(self.dashboard_service.order_service, 'get_average_order_value', return_value=100.0), \
                patch.object(self.dashboard_service.order_service, 'get_total_sales_for_month', return_value=100.0), \
                patch.object(self.dashboard_service.order_service, 'get_sales_overtime_data', return_value=[]), \
                patch.object(self.dashboard_service.order_service, 'get_latest_orders_data', return_value=[]):
            kpis_data = self.dashboard_service.get_kpis_data()
            self.assertIn('avg_order_value', kpis_data)
            self.assertIn('metrics_growth', kpis_data)


class CollectionServiceTests(TestCase):
    def setUp(self):
        self.collection_service = CollectionService()
        self.collection1 = Collection.objects.create(name='Gaming Collection', status='PENDING', category='GAMING')
        self.card1 = Card.objects.create(collection=self.collection1, name='Card 1', category='COMMON')

    def test_get_total_collections_count(self):
        count = self.collection_service.get_total_collections_count()
        self.assertEqual(count, 1)

    def test_get_detailed_collections_list_no_filters(self):
        result = self.collection_service.get_detailed_collections_list()
        self.assertEqual(len(result['items']), 1)
        self.assertEqual(result['items'][0]['collectionName'], 'Gaming Collection')

    def test_get_collections_count_for_month(self):
        current_year = timezone.now().year
        current_month = timezone.now().month
        Collection.objects.filter(id=self.collection1.id).update(
            created_at=datetime(current_year, current_month, 1, tzinfo=dt_timezone.utc)
        )
        count = self.collection_service.get_collections_count_for_month(current_year, current_month)
        self.assertEqual(count, 1)


class CardServiceTests(TestCase):
    def setUp(self):
        self.card_service = CardService()
        self.collection = Collection.objects.create(name='Test Collection', status='ISSUED')
        self.card1 = Card.objects.create(collection=self.collection, name='Card 1', category='COMMON')

    def test_get_total_cards_count(self):
        count = self.card_service.get_total_cards_count()
        self.assertEqual(count, 1)

    def test_get_cards_count_for_month(self):
        current_year = timezone.now().year
        current_month = timezone.now().month
        # Mocking for simplicity as real `created_at` update needs more setup
        with patch.object(self.card_service.card_repo, 'get_all') as mock_get_all:
            mock_get_all.return_value.filter.return_value.count.return_value = 1
            count = self.card_service.get_cards_count_for_month(current_year, current_month)
            self.assertEqual(count, 1)


class OrderServiceTests(TestCase):
    def setUp(self):
        self.order_service = OrderService()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.collection = Collection.objects.create(name='Test Collection', status='ISSUED')
        self.card1 = Card.objects.create(collection=self.collection, name='Card 1', category='COMMON')
        self.order1 = Order.objects.create(user=self.user, order_value=100.00, status='COMPLETED')
        OrderItem.objects.create(order=self.order1, card=self.card1, quantity=1, price_at_purchase=100.00)

    def test_get_average_order_value(self):
        avg_value = self.order_service.get_average_order_value()
        self.assertAlmostEqual(avg_value, 100.00, delta=0.01)

    def test_get_latest_orders_data(self):
        latest_orders = self.order_service.get_latest_orders_data()
        self.assertEqual(len(latest_orders), 1)
        self.assertIn('order_id', latest_orders[0])

    def test_get_total_sales_for_month(self):
        current_year = timezone.now().year
        current_month = timezone.now().month
        Order.objects.filter(id=self.order1.id).update(
            order_date=datetime(current_year, current_month, 1, tzinfo=dt_timezone.utc)
        )
        sales = self.order_service.get_total_sales_for_month(current_year, current_month)
        self.assertEqual(sales, 100.0)


class UserServiceTests(TestCase):
    def setUp(self):
        self.user_service = UserService()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password123')

    def test_get_user_profile_data(self):
        profile_data = self.user_service.get_user_profile_data(self.user1)
        self.assertEqual(profile_data['username'], 'user1')

    def test_get_total_users_count(self):
        count = self.user_service.get_total_users_count()
        self.assertEqual(count, 1)

    def test_get_users_count_for_month(self):
        current_year = timezone.now().year
        current_month = timezone.now().month
        User.objects.filter(id=self.user1.id).update(
            date_joined=datetime(current_year, current_month, 1, tzinfo=dt_timezone.utc)
        )
        count = self.user_service.get_users_count_for_month(current_year, current_month)
        self.assertEqual(count, 1)