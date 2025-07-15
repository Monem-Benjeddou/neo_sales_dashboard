from ..models import Card
import uuid

class CardRepository:
    def get_all(self):
        return Card.objects.all()

    def get_by_id(self, card_id):
        try:
            uuid_id = uuid.UUID(card_id) if isinstance(card_id, str) else card_id
            return Card.objects.get(id=uuid_id)
        except (ValueError, Card.DoesNotExist):
            return None

    def get_count(self):
        return Card.objects.count()