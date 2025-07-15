from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class APIBaseTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuserapi', email='testapi@example.com', password='testpassword')
        self.admin_user = User.objects.create_superuser(username='adminapi', email='adminapi@example.com', password='adminpassword')

    def get_auth_headers(self, user):
        password = 'testpassword' if user == self.user else 'adminpassword'
        response = self.client.post(reverse('token_obtain_pair'), {'username': user.username, 'password': password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        return {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}

    def test_login_with_email(self):
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testapi@example.com', 'password': 'testpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)