from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..serializers import UserSerializer
from ..services.user_service import UserService
from ..utils.response_utils import api_response, error_response
from ..permissions import IsSuperUserOrReadOnly

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    user_service = UserService()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsSuperUserOrReadOnly()]
        return [IsAuthenticated()]

    def get(self, request, format=None):
        try:
            user_data = self.user_service.get_user_profile_data(request.user)
            return api_response(data=user_data)
        except Exception as e:
            return error_response(
                message=f"Failed to retrieve user profile: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                data=serializer.data,
                message="User profile updated successfully"
            )
        return error_response(
            message="Invalid user data",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=serializer.errors
        )

    def patch(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                data=serializer.data,
                message="User profile updated successfully"
            )
        return error_response(
            message="Invalid user data",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=serializer.errors
        )