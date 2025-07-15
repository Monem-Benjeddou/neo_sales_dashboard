from django.db import models
from .user import User

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    STATUS_CHOICES = [
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', to_field='id')
    order_value = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROCESSING')
    order_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-order_date']

    def __str__(self):
        return f"Order #{self.id} by {self.user.username} - ${self.order_value}"