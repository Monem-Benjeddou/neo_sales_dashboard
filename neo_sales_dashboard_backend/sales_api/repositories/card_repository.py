from ..models import Card

class CardRepository:
    def get_all(self):
        return Card.objects.all()

    def get_by_id(self, card_id):
        return Card.objects.get(id=card_id)

    def get_count(self):
        return Card.objects.count()