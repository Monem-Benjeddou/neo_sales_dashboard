from ..repositories.user_repository import UserRepository
from ..serializers import UserSerializer
from datetime import datetime, timedelta, timezone as dt_timezone

class UserService:
    def __init__(self, user_repo=None):
        self.user_repo = user_repo or UserRepository()

    def get_user_profile_data(self, user):
        return UserSerializer(user).data

    def get_total_users_count(self):
        return self.user_repo.get_non_superuser_count()

    def get_users_count_for_month(self, year: int, month: int) -> int:
        """
        Counts non-superuser users created in a specific month.
        """
        start_of_month = datetime(year, month, 1, tzinfo=dt_timezone.utc)

        if month == 12:
            end_of_month = datetime(year + 1, 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)
        else:
            end_of_month = datetime(year, month + 1, 1, tzinfo=dt_timezone.utc) - timedelta(microseconds=1)

        return self.user_repo.get_all().filter(
            date_joined__gte=start_of_month,
            date_joined__lte=end_of_month,
            is_superuser=False
        ).count()
