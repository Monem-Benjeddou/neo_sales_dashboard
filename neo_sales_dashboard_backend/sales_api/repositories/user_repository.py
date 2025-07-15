from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class UserRepository:
    def get_all(self):
        return User.objects.all()

    def get_by_id(self, user_id):
        try:
            uuid_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
            return User.objects.get(id=uuid_id)
        except (ValueError, User.DoesNotExist):
            return None

    def get_non_superuser_count(self):
        return User.objects.filter(is_superuser=False).count()