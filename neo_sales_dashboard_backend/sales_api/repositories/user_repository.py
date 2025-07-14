from django.contrib.auth import get_user_model

User = get_user_model()

class UserRepository:
    def get_all(self):
        return User.objects.all()

    def get_by_id(self, user_id):
        return User.objects.get(id=user_id)

    def get_non_superuser_count(self):
        return User.objects.filter(is_superuser=False).count()