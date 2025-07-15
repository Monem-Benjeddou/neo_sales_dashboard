from django.db.models import Sum, Avg
from django.db.models.functions import TruncMonth
from ..models import Order
import uuid

class OrderRepository:
    def get_all(self):
        return Order.objects.all()

    def get_by_id(self, order_id):
        try:
            uuid_id = uuid.UUID(order_id) if isinstance(order_id, str) else order_id
            return Order.objects.get(id=uuid_id)
        except (ValueError, Order.DoesNotExist):
            return None

    def get_average_value(self):
        return Order.objects.aggregate(avg_value=Avg('order_value'))['avg_value']

    def get_sales_data_for_period(self, start_date, end_date, status='COMPLETED'):
        return Order.objects.filter(
            order_date__lte=end_date,
            order_date__gte=start_date,
            status=status
        ).annotate(
            month=TruncMonth('order_date')
        ).values('month').annotate(
            total_sales=Sum('order_value')
        ).order_by('month')

    def get_latest(self, limit=4):
        return Order.objects.order_by('-order_date')[:limit]