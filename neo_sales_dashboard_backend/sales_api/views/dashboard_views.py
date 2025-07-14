from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..services.dashboard_service import DashboardService

class DashboardKPIsView(APIView):
    permission_classes = [IsAuthenticated]
    dashboard_service = DashboardService()

    def get(self, request, format=None):
        kpis = self.dashboard_service.get_kpis_data()
        return Response(kpis, status=status.HTTP_200_OK)