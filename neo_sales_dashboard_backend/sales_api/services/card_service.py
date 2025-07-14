from ..repositories.card_repository import CardRepository
from django.utils import timezone as dj_timezone
from datetime import datetime, timedelta, timezone as dt_timezone

class CardService:
    def __init__(self, card_repo=None):
        self.card_repo = card_repo or CardRepository()

    def get_total_cards_count(self):
        return self.card_repo.get_count()

    def get_cards_count_for_month(self, year: int, month: int) -> int:
        """
        Counts cards created in a specific month.
        """
        start_of_month = datetime(year, month, 1, tzinfo=dt_timezone.utc)

        if month == 12:
            end_of_month = datetime(year + 1, 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)
        else:
            end_of_month = datetime(year, month + 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)

        return self.card_repo.get_all().filter(
            created_at__gte=start_of_month,
            created_at__lte=end_of_month
        ).count()
