from django.db import models
from .collection import Collection
class Card(models.Model):
    CATEGORY_CHOICES = [
        ('COMMON', 'Common'),
        ('RARE', 'Rare'),
        ('EPIC', 'Epic'),
        ('LEGENDARY', 'Legendary'),
    ]
    RARITY_CHOICES = [
        ('BRONZE', 'Bronze'),
        ('SILVER', 'Silver'),
        ('GOLD', 'Gold'),
        ('PLATINUM', 'Platinum'),
    ]
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='cards')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='COMMON')
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='BRONZE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Card'
        verbose_name_plural = 'Cards'
        unique_together = ('collection', 'name')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.collection.name})"