from django.urls import reverse
from rest_framework import status
from datetime import datetime, timedelta
from sales_api.tests.test_api_base import APIBaseTest
from sales_api.models.collection import Collection
from sales_api.models.card import Card


class CollectionAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.collection1 = Collection.objects.create(
            name='Test Collection 1',
            status='PENDING',
            expected_release_date=datetime.now().date() + timedelta(days=30),
            issuer_name='Test Issuer A',
            category='GAMING'
        )
        self.collection2 = Collection.objects.create(
            name='Test Collection 2',
            status='IN_PRODUCTION',
            expected_release_date=datetime.now().date() + timedelta(days=60),
            issuer_name='Test Issuer B',
            category='ESPORT'
        )
        # Just one card for minimal setup
        Card.objects.create(
            name='Test Card 1',
            collection=self.collection1,
            rarity='BRONZE',
            category='COMMON',
        )

    ## Core API Tests

    def test_list_collections_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collection-list'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_list_collections_unauthenticated(self):
        response = self.client.get(reverse('collection-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_collection_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collection-detail', args=[self.collection1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Collection 1')

    def test_create_collection_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        new_collection_data = {
            'name': 'New Admin Collection',
            'status': 'PENDING',
            'expected_release_date': (datetime.now().date() + timedelta(days=90)).isoformat(),
            'issuer_name': 'New Issuer X',
            'category': 'SPORTS'
        }
        response = self.client.post(reverse('collection-list'), new_collection_data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Collection.objects.filter(name='New Admin Collection').exists())

    def test_create_collection_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        new_collection_data = {
            'name': 'Forbidden Collection',
            'status': 'PENDING',
            'expected_release_date': (datetime.now().date() + timedelta(days=90)).isoformat(),
            'issuer_name': 'Forbidden Issuer',
            'category': 'OTHER'
        }
        response = self.client.post(reverse('collection-list'), new_collection_data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_collection_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        updated_data = {'name': 'Updated Name'}
        response = self.client.put(reverse('collection-detail', args=[self.collection1.id]), updated_data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.collection1.refresh_from_db()
        self.assertEqual(self.collection1.name, 'Updated Name')

    def test_update_collection_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        updated_data = {'name': 'Forbidden Update'}
        response = self.client.put(reverse('collection-detail', args=[self.collection1.id]), updated_data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_collection_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        response = self.client.delete(reverse('collection-detail', args=[self.collection1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Collection.objects.filter(id=self.collection1.id).exists())

    def test_delete_collection_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.delete(reverse('collection-detail', args=[self.collection2.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class CollectionsListViewTests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.collection1 = Collection.objects.create(
            name='Gaming Collection',
            status='PENDING',
            expected_release_date=datetime.now().date() + timedelta(days=30),
            issuer_name='Game Publisher',
            category='GAMING'
        )
        self.collection2 = Collection.objects.create(
            name='Art Collection',
            status='IN_PRODUCTION',
            expected_release_date=datetime.now().date() + timedelta(days=60),
            issuer_name='Art Studio',
            category='ART'
        )
        Card.objects.create(name='Sample Card 1', collection=self.collection1, rarity='BRONZE', category='COMMON')


    def test_collections_list_unauthenticated(self):
        response = self.client.get(reverse('collections-list-view'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_collections_list_with_search(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(f"{reverse('collections-list-view')}?search=Gaming", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['pagination']['totalItems'], 1)
        self.assertEqual(response.data['items'][0]['collectionName'], 'Gaming Collection')

    def test_collections_list_with_category_filter(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(f"{reverse('collections-list-view')}?category=ART", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['pagination']['totalItems'], 1)
        self.assertEqual(response.data['items'][0]['category'], 'Art')

    def test_collections_list_pagination(self):
        headers = self.get_auth_headers(self.user)
        # Create a few more collections to ensure pagination has data
        for i in range(3, 7):
            Collection.objects.create(
                name=f'Collection {i}',
                status='PENDING',
                expected_release_date=datetime.now().date() + timedelta(days=i),
                issuer_name=f'Issuer {i}',
                category='OTHER'
            )
        response = self.client.get(f"{reverse('collections-list-view')}?page=1&pageSize=3", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertGreaterEqual(response.data['pagination']['totalItems'], 6) # 2 initial + 4 new