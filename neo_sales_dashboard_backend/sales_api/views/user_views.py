from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..serializers import UserSerializer
from ..services.user_service import UserService

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    user_service = UserService()

    def get(self, request, format=None):
        user_data = self.user_service.get_user_profile_data(request.user)
        return Response(user_data, status=status.HTTP_200_OK)

    def put(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)