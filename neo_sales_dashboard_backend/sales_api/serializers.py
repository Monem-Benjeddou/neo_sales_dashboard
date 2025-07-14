from rest_framework import serializers
from .models import User, Collection, Card, Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CollectionSerializer(serializers.ModelSerializer):
    number_of_card_designs = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Collection
        fields = '__all__'

    def get_number_of_card_designs(self, obj):
        return obj.cards.count()

class CardSerializer(serializers.ModelSerializer):
    collection = CollectionSerializer(read_only=True)
    class Meta:
        model = Card
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    order_date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_order_date_formatted(self, obj):
        return obj.order_date.strftime('%b %d, %I:%M %p').replace('AM', 'am').replace('PM', 'pm')

