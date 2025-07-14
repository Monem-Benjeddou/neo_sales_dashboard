from collections import OrderedDict
from datetime import datetime, timedelta, timezone as dt_timezone  # ✅ Correct import
from django.utils import timezone
from django.db.models import Sum

from ..repositories.order_repository import OrderRepository
from ..serializers import OrderSerializer

class OrderService:
    def __init__(self, order_repo=None):
        self.order_repo = order_repo or OrderRepository()

    def get_average_order_value(self):
        avg_value = self.order_repo.get_average_value()
        return float(avg_value) if avg_value is not None else 0.00

    def get_sales_overtime_data(self, num_months=8):
        today = timezone.now()
        start_date = today - timedelta(days=num_months * 30)
        sales_overtime_raw = self.order_repo.get_sales_data_for_period(start_date, today, status='COMPLETED')

        sales_by_month = OrderedDict()
        for i in range(num_months - 1, -1, -1):
            month_date = (today - timedelta(days=30 * i)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_key = month_date.strftime('%Y-%m')
            sales_by_month[month_key] = {'month': month_date.strftime('%b'), 'value': 0}

        for entry in sales_overtime_raw:
            month_key = entry['month'].strftime('%Y-%m')
            if month_key in sales_by_month:
                sales_by_month[month_key]['value'] = float(entry['total_sales'])

        return list(sales_by_month.values())

    def get_latest_orders_data(self, limit=4):
        latest_orders_queryset = self.order_repo.get_latest(limit=limit)
        return OrderSerializer(latest_orders_queryset, many=True).data

    def get_total_sales_for_month(self, year: int, month: int) -> float:
        """
        Gets total completed sales for a specific month.
        """
        start_of_month = datetime(year, month, 1, tzinfo=dt_timezone.utc)

        if month == 12:
            end_of_month = datetime(year + 1, 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)
        else:
            end_of_month = datetime(year, month + 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)

        total_sales = self.order_repo.get_all().filter(
            order_date__gte=start_of_month,
            order_date__lte=end_of_month,
            status='COMPLETED'
        ).aggregate(total=Sum('order_value'))['total']

        return float(total_sales) if total_sales is not None else 0.0
