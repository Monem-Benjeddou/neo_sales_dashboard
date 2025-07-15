from ..repositories.collection_repository import CollectionRepository
from datetime import datetime, timedelta, timezone as dt_timezone

class CollectionService:
    def __init__(self, collection_repo=None):
        self.collection_repo = collection_repo or CollectionRepository()

    def get_total_collections_count(self):
        return self.collection_repo.get_count()

    def get_detailed_collections_list(self, filters=None, page=1, page_size=10):
        # Get filtered queryset
        collections_queryset = self.collection_repo.get_all_with_card_count(filters=filters).order_by('id')

        # Calculate pagination values
        total_items = collections_queryset.count()
        total_pages = (total_items + page_size - 1) // page_size  # Ceiling division
        
        # Apply pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_queryset = collections_queryset[start_index:end_index]
        

        collections_data = []
        for collection in paginated_queryset:
            collections_data.append({
                'collectionId': collection.id,
                'collectionName': collection.name,
                'issuerName': collection.issuer_name,
                'expectedReleaseDate': collection.expected_release_date.strftime('%d/%m/%Y') if collection.expected_release_date else None,
                'numberOfCardDesigns': collection.num_card_designs,
                'category': collection.get_category_display(),
                'status': collection.get_status_display(),
            })
        
        # Return data with pagination metadata
        return {
            'items': collections_data,
            'pagination': {
                'page': page,
                'pageSize': page_size,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_collections_count_for_month(self, year: int, month: int) -> int:
        start_of_month = datetime(year, month, 1, tzinfo=dt_timezone.utc)
        if month == 12:
            end_of_month = datetime(year + 1, 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)
        else:
            end_of_month = datetime(year, month + 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)

        return self.collection_repo.get_all().filter(
            created_at__gte=start_of_month,
            created_at__lte=end_of_month
        ).count()
