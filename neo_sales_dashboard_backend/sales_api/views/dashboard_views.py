from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from ..services.dashboard_service import DashboardService
from ..utils.response_utils import api_response, error_response
from ..permissions import IsSuperUserOrReadOnly

class DashboardKPIsView(APIView):
    permission_classes = [IsAuthenticated]
    dashboard_service = DashboardService()

    def get(self, request, format=None):
        try:
            print('fuck')
            kpis = self.dashboard_service.get_kpis_data()
            return api_response(data=kpis)
        except Exception as e:
            return error_response(
                message=f"Failed to retrieve fuck u dashboard KPIs: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="dashboard_kpis_error"
            )