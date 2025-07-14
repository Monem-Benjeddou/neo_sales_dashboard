from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, CollectionViewSet, CardViewSet, OrderViewSet, DashboardKPIsView, CollectionsListView, MeView
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'cards', CardViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(router.urls)),
    path('dashboard/kpis/', DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('collections-list/', CollectionsListView.as_view(), name='collections-list'),
    path('auth/me/', MeView.as_view(), name='me'),
]