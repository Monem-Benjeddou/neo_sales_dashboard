import redis
import json
from django.utils import timezone
from datetime import timedelta
from .user_service import UserService
from .collection_service import CollectionService
from .card_service import CardService
from .order_service import OrderService
import logging

logger = logging.getLogger(__name__)

class DashboardService:
    def __init__(self):
        self.user_service = UserService()
        self.collection_service = CollectionService()
        self.card_service = CardService()
        self.order_service = OrderService()
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, db=0, socket_connect_timeout=1)
            self.redis_client.ping()
            logger.info("Successfully connected to Redis.")
            self.redis_connected = True
        except redis.exceptions.ConnectionError as e:
            logger.error(f"Could not connect to Redis: {e}. Caching will be disabled.")
            self.redis_client = None
            self.redis_connected = False

    def _calculate_growth(self, current_value: float, previous_value: float) -> str:
        if previous_value == 0:
            return "+0.00%" if current_value == 0 else "+Inf%"

        growth = ((current_value - previous_value) / previous_value) * 100
        return f"{'+' if growth >= 0 else ''}{growth:.2f}%"

    def get_kpis_data(self):
        cache_key = "dashboard_kpis_data"
        cache_expiration_seconds = 60 * 60

        cached_data = None
        if self.redis_connected:
            try:
                cached_data = self.redis_client.get(cache_key)
                if cached_data:
                    logger.info("Retrieving KPI data from Redis cache.")
                    return json.loads(cached_data)
            except redis.exceptions.ConnectionError as e:
                logger.error(f"Redis connection error during GET: {e}. Proceeding without cache.")
                self.redis_connected = False
            except json.JSONDecodeError as e:
                logger.error(f"Error decoding cached data from Redis: {e}. Fetching new data.")
                cached_data = None

        logger.info("KPI data not found in cache or Redis not connected, fetching from services.")

        today = timezone.localdate()
        current_month = today.month
        current_year = today.year

        previous_month_date = today.replace(day=1) - timedelta(days=1)
        previous_month = previous_month_date.month
        previous_year = previous_month_date.year

        avg_order_value_current = self.order_service.get_average_order_value()
        total_created_cards_current = self.card_service.get_total_cards_count()
        total_collections_created_current = self.collection_service.get_total_collections_count()
        total_users_account_current = self.user_service.get_total_users_count()
        sales_overtime_data = self.order_service.get_sales_overtime_data()
        latest_orders_data = self.order_service.get_latest_orders_data()

        new_cards_current_month = self.card_service.get_cards_count_for_month(current_year, current_month)
        new_cards_previous_month = self.card_service.get_cards_count_for_month(previous_year, previous_month)
        collections_created_current_month = self.collection_service.get_collections_count_for_month(current_year, current_month)
        collections_created_previous_month = self.collection_service.get_collections_count_for_month(previous_year, previous_month)
        print('b')

        users_joined_current_month = self.user_service.get_users_count_for_month(current_year, current_month)
        users_joined_previous_month = self.user_service.get_users_count_for_month(previous_year, previous_month)

        total_sales_current_month = self.order_service.get_total_sales_for_month(current_year, current_month)
        total_sales_previous_month = self.order_service.get_total_sales_for_month(previous_year, previous_month)

        metrics_growth = {
            'avg_order_value_growth': self._calculate_growth(total_sales_current_month, total_sales_previous_month),
            'total_collections_growth': self._calculate_growth(collections_created_current_month, collections_created_previous_month),
            'total_users_growth': self._calculate_growth(users_joined_current_month, users_joined_previous_month),
            'new_cards_count': new_cards_current_month,
            'new_cards_growth': self._calculate_growth(new_cards_current_month, new_cards_previous_month),
        }

        kpis_data = {
            'avg_order_value': avg_order_value_current,
            'total_created_cards': total_created_cards_current,
            'total_collections_created': total_collections_created_current,
            'total_users_account': total_users_account_current,
            'sales_overtime': sales_overtime_data,
            'latest_orders': latest_orders_data,
            'metrics_growth': metrics_growth,
        }

        if self.redis_connected:
            try:
                self.redis_client.setex(cache_key, cache_expiration_seconds, json.dumps(kpis_data))
                logger.info("KPI data stored in Redis cache.")
            except redis.exceptions.ConnectionError as e:
                logger.error(f"Redis connection error during SET: {e}. Data not cached.")
            except Exception as e:
                logger.error(f"An unexpected error occurred while caching data: {e}")

        return kpis_data