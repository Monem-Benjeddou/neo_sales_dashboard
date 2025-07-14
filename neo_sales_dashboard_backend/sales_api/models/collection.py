from django.db import models

class Collection(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PRODUCTION', 'In Production'),
        ('ISSUED', 'Issued'),
        ('PUBLIC', 'Public'),
    ]
    CATEGORY_CHOICES = [
        ('ESPORT', 'Esport'),
        ('GAMING', 'Gaming'),
        ('ART', 'Art'),
        ('SPORTS', 'Sports'),
        ('OTHER', 'Other'),
    ]
    name = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    expected_release_date = models.DateField(null=True, blank=True)
    issuer_name = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Collection'
        verbose_name_plural = 'Collections'
        ordering = ['-created_at']

    def __str__(self):
        return self.name