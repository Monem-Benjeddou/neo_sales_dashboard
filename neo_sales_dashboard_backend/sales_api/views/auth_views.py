from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        password = attrs.get("password")
        user_identifier = attrs.get("username")
        if user_identifier == "authuser@example.com":
            print(user_identifier)
        if '@' in user_identifier:
            user = User.objects.filter(email=user_identifier).first()
            if user:
                attrs[self.username_field] = user.username
        
        return super().validate(attrs)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer