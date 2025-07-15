from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..utils.response_utils import api_response, error_response

from ..serializers import UserSerializer, CollectionSerializer, CardSerializer, OrderSerializer
from ..permissions import IsAuthenticatedUser, IsSuperUserOrReadOnly
from ..models import User, Collection, Card, Order
from ..services.collection_service import CollectionService

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CollectionsListView(APIView):
    permission_classes = [IsAuthenticated]
    collection_service = CollectionService()

    def get(self, request, format=None):
        try:
            # Parse pagination parameters
            try:
                page = int(request.query_params.get('page', 1))
                page_size = int(request.query_params.get('pageSize', 10))
                page = max(1, page)
                page_size = max(1, min(100, page_size))
            except ValueError:
                return error_response(
                    "Invalid pagination parameters", 
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="invalid_pagination",
                    details={"page": "Must be a valid integer", "pageSize": "Must be a valid integer"}
                )
            
            # Build filters
            filters = {}
            if 'search' in request.query_params:
                filters['search'] = request.query_params.get('search')
            if 'name' in request.query_params:
                filters['name'] = request.query_params.get('name')
            
            if 'issuerName' in request.query_params:
                filters['issuer_name'] = request.query_params.get('issuerName')
            
            if 'status' in request.query_params:
                filters['status'] = request.query_params.get('status')
            
            if 'category' in request.query_params:
                filters['category'] = request.query_params.get('category')

            # Parse date filters
            date_errors = {}
            if 'releaseDateFrom' in request.query_params:
                try:
                    filters['release_date_from'] = request.query_params.get('releaseDateFrom')
                except ValueError:
                    date_errors['releaseDateFrom'] = "Must be a valid date format (YYYY-MM-DD)"
            
            if 'releaseDateTo' in request.query_params:
                try:
                    filters['release_date_to'] = request.query_params.get('releaseDateTo')
                except ValueError:
                    date_errors['releaseDateTo'] = "Must be a valid date format (YYYY-MM-DD)"
            
            if date_errors:
                return error_response(
                    "Invalid date parameters", 
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="invalid_date_format",
                    details=date_errors
                )
            
            # Get collections data
            collections_data = self.collection_service.get_detailed_collections_list(
                filters=filters,
                page=page,
                page_size=page_size
            )
            
            return api_response(data=collections_data)
            
        except Exception as e:
            return error_response(
                f"Failed to retrieve collections: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )