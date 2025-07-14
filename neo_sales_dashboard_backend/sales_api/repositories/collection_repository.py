from django.db.models import Count
from ..models import Collection

class CollectionRepository:
    def get_all(self):
        return Collection.objects.all()

    def get_by_id(self, collection_id):
        return Collection.objects.get(id=collection_id)

    def get_count(self):
        return Collection.objects.count()

    def get_all_with_card_count(self):
        return Collection.objects.annotate(num_card_designs=Count('cards'))