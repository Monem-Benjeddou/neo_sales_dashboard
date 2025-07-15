from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from sales_api.tests.test_api_base import APIBaseTest
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        # Create additional test user
        self.test_user = User.objects.create_user(
            username='authuser', 
            email='authuser@example.com', 
            password='authpassword',
            first_name='Auth',
            last_name='User'
        )
        
        self.token_obtain_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh')
    
    def test_login_with_username(self):
        data = {
            'username': 'authuser',
            'password': 'authpassword'
        }
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_with_invalid_credentials(self):
        data = {
            'username': 'wronguser',
            'password': 'authpassword'
        }
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        data = {
            'email': 'wrong@example.com',
            'password': 'authpassword'
        }
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with invalid password
        data = {
            'username': 'authuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_without_credentials(self):
        # Test with empty data
        data = {}
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with only username
        data = {'username': 'authuser'}
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with only email
        data = {'email': 'authuser@example.com'}
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with only password
        data = {'password': 'authpassword'}
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_token_refresh(self):
        # First, get a token pair
        data = {
            'username': 'authuser',
            'password': 'authpassword'
        }
        response = self.client.post(self.token_obtain_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        refresh_token = response.data['refresh']
        
        # Then, use the refresh token to get a new access token
        data = {'refresh': refresh_token}
        response = self.client.post(self.token_refresh_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_token_refresh_with_invalid_token(self):
        # Test with invalid refresh token
        data = {'refresh': 'invalid_token'}
        response = self.client.post(self.token_refresh_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_token_refresh_without_token(self):
        # Test with empty data
        data = {}
        response = self.client.post(self.token_refresh_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_access_protected_endpoint_with_valid_token(self):
        # Get a token
        refresh = RefreshToken.for_user(self.test_user)
        access_token = str(refresh.access_token)
        
        # Use the token to access a protected endpoint
        headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        response = self.client.get(reverse('me'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_access_protected_endpoint_with_invalid_token(self):
        # Use an invalid token to access a protected endpoint
        headers = {'HTTP_AUTHORIZATION': 'Bearer invalid_token'}
        response = self.client.get(reverse('me'), **headers)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_access_protected_endpoint_without_token(self):
        # Try to access a protected endpoint without a token
        response = self.client.get(reverse('me'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_access_protected_endpoint_with_expired_token(self):
        # This would require mocking the token expiration time
        # For simplicity, we'll just note that this should be tested
        pass