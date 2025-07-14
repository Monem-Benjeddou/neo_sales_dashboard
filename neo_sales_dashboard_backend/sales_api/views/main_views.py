from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..serializers import UserSerializer, CollectionSerializer, CardSerializer, OrderSerializer
from ..permissions import IsAuthenticatedUser
from ..models import User, Collection, Card, Order
from ..services.collection_service import CollectionService

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedUser]

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticatedUser]

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticatedUser]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticatedUser]

class CollectionsListView(APIView):
    permission_classes = [IsAuthenticated]
    collection_service = CollectionService()

    def get(self, request, format=None):
        collections_data = self.collection_service.get_detailed_collections_list()
        return Response(collections_data, status=200)