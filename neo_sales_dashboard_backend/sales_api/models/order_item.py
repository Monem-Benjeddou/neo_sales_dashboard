from django.db import models
from .order import Order
from .card import Card


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', to_field='id')
    card = models.ForeignKey(Card, on_delete=models.PROTECT, related_name='order_items', to_field='id')

    copy_number = models.CharField(max_length=50, blank=True, null=True)

    quantity = models.PositiveIntegerField(default=1)

    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
        unique_together = ('order', 'card', 'copy_number')

    def __str__(self):
        return f"Order #{self.order.id} - {self.card.name} (Copy: {self.copy_number or 'N/A'})"