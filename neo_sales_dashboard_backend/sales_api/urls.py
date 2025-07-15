from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, CollectionViewSet, CardViewSet, OrderViewSet, DashboardKPIsView, CollectionsListView, MeView
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'collections', CollectionViewSet, basename='collection') # This would handle /api/collections/ for ViewSet
router.register(r'cards', CardViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(router.urls)),
    path('dashboard/kpis/', DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('collections', CollectionsListView.as_view(), name='collections-list-view'),
    path('auth/me/', MeView.as_view(), name='me'),
]