from django.db.models import Count, Q
from ..models import Collection
import uuid

class CollectionRepository:
    def get_all(self):
        return Collection.objects.all()

    def get_by_id(self, collection_id):
        try:
            uuid_id = uuid.UUID(collection_id) if isinstance(collection_id, str) else collection_id
            return Collection.objects.get(id=uuid_id)
        except (ValueError, Collection.DoesNotExist):
            return None

    def get_count(self):
        return Collection.objects.count()

    def get_all_with_card_count(self, filters=None):
        queryset = Collection.objects.annotate(num_card_designs=Count('cards'))

        if filters:
            if 'search' in filters and filters['search']:
                search_term = filters['search']
                queryset = queryset.filter(
                    Q(name__icontains=search_term) |
                    Q(issuer_name__icontains=search_term) |
                    Q(category__icontains=search_term)
                )

            # Filter by name (case-insensitive partial match)
            if 'name' in filters and filters['name']:
                queryset = queryset.filter(name__icontains=filters['name'])

            # Filter by status
            if 'status' in filters and filters['status']:
                queryset = queryset.filter(status=filters['status'])

            # Filter by category
            if 'category' in filters and filters['category']:
                queryset = queryset.filter(category=filters['category'])

            # Filter by issuer name
            if 'issuer_name' in filters and filters['issuer_name']:
                queryset = queryset.filter(issuer_name__icontains=filters['issuer_name'])

            # Filter by expected release date range
            if 'release_date_from' in filters and filters['release_date_from']:
                queryset = queryset.filter(expected_release_date__gte=filters['release_date_from'])

            if 'release_date_to' in filters and filters['release_date_to']:
                queryset = queryset.filter(expected_release_date__lte=filters['release_date_to'])

        return queryset
