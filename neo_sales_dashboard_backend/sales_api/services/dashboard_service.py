from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache

from .user_service import UserService
from .collection_service import CollectionService
from .card_service import CardService
from .order_service import OrderService


class DashboardService:
    def __init__(self):
        self.user_service = UserService()
        self.collection_service = CollectionService()
        self.card_service = CardService()
        self.order_service = OrderService()

    def _calculate_growth(self, current_value: float, previous_value: float) -> str:
        if previous_value == 0:
            return "+0.00%" if current_value == 0 else "+Inf%"

        growth = ((current_value - previous_value) / previous_value) * 100
        return f"{'+' if growth >= 0 else ''}{growth:.2f}%"

    def get_kpis_data(self):
        cache_key = "dashboard_kpis_data"
        cache_timeout = 60 * 5

        kpis_data = cache.get(cache_key)

        if kpis_data is not None:
            return kpis_data

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

        cache.set(cache_key, kpis_data, timeout=cache_timeout)

        return kpis_data