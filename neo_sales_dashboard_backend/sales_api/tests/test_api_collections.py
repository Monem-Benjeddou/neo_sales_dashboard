from django.urls import reverse
from rest_framework import status
from sales_api.tests.test_api_base import APIBaseTest
from sales_api.models import Collection

class CollectionAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.collection1 = Collection.objects.create(name='Gaming Collection', status='PENDING')
        self.collection2 = Collection.objects.create(name='Art Collection', status='ISSUED')
        self.collection3 = Collection.objects.create(name='Sports Collection', status='PENDING')
        self.collection4 = Collection.objects.create(name='Esport Collection', status='ISSUED')

    def test_list_collections(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collection-list'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_create_collection_authenticated(self):
        headers = self.get_auth_headers(self.admin_user)
        data = {'name': 'New Collection', 'status': 'PENDING'}
        response = self.client.post(reverse('collection-list'), data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Collection.objects.count(), 5)

    def test_create_collection_unauthenticated(self):
        data = {'name': 'Unauthorized Collection', 'status': 'PENDING'}
        response = self.client.post(reverse('collection-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_collections_pagination(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collections-list-view') + '?page=1&pageSize=2', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 2)
        self.assertIn('totalItems', response.data['pagination'])
        self.assertEqual(response.data['pagination']['totalItems'], 4)

        response = self.client.get(reverse('collections-list-view') + '?page=2&pageSize=2', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 2)

    def test_collections_filtering(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('collections-list-view') + '?search=Art', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['collectionName'], 'Art Collection')

        response = self.client.get(reverse('collections-list-view') + '?status=PENDING', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 2)
        collection_names = [item['collectionName'] for item in response.data['items']]
        self.assertIn('Gaming Collection', collection_names)
        self.assertIn('Sports Collection', collection_names)

    # New tests for superuser permissions

    def test_superuser_can_update_collection(self):
        headers = self.get_auth_headers(self.admin_user)
        data = {'name': 'Updated Gaming Collection', 'status': 'ISSUED'}
        response = self.client.put(reverse('collection-detail', args=[self.collection1.id]), data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.collection1.refresh_from_db()
        self.assertEqual(self.collection1.name, 'Updated Gaming Collection')
        self.assertEqual(self.collection1.status, 'ISSUED')

    def test_regular_user_cannot_update_collection(self):
        headers = self.get_auth_headers(self.user)
        data = {'name': 'Attempted Update', 'status': 'ISSUED'}
        response = self.client.put(reverse('collection-detail', args=[self.collection1.id]), data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_superuser_can_delete_collection(self):
        headers = self.get_auth_headers(self.admin_user)
        response = self.client.delete(reverse('collection-detail', args=[self.collection1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Collection.objects.count(), 3)
        self.assertFalse(Collection.objects.filter(id=self.collection1.id).exists())

    def test_regular_user_cannot_delete_collection(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.delete(reverse('collection-detail', args=[self.collection1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_collection(self):
        data = {'name': 'Attempted Update', 'status': 'ISSUED'}
        response = self.client.put(reverse('collection-detail', args=[self.collection1.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_cannot_delete_collection(self):
        response = self.client.delete(reverse('collection-detail', args=[self.collection1.id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)