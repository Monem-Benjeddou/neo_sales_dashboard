from django.urls import reverse
from rest_framework import status
from sales_api.tests.test_api_base import APIBaseTest
from sales_api.models.collection import Collection
from sales_api.models.card import Card


class CardAPITests(APIBaseTest):
    def setUp(self):
        super().setUp()
        self.collection1 = Collection.objects.create(
            name='Test Collection 1',
            status='PENDING',
            issuer_name='Test Issuer 1',
            category='GAMING',
            id=2
        )
        self.collection2 = Collection.objects.create(
            name='Test Collection 2',
            status='IN_PRODUCTION',
            issuer_name='Test Issuer 2',
            category='ESPORT',
            id=4
        )

        self.card1 = Card.objects.create(
            name='Test Card 1',
            collection=self.collection1,
            rarity='BRONZE',
            category='COMMON'
        )
        self.card2 = Card.objects.create(
            name='Test Card 2',
            collection=self.collection1,
            rarity='GOLD',
            category='RARE'
        )
        self.card3 = Card.objects.create(
            name='Test Card 3',
            collection=self.collection2,
            rarity='PLATINUM',
            category='LEGENDARY'
        )

    def test_list_cards_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('card-list'), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 3)

    def test_list_cards_unauthenticated(self):
        response = self.client.get(reverse('card-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_card_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.get(reverse('card-detail', args=[self.card1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Card 1')

    def test_create_card_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        new_card_data = {
            'name': 'New Card',
            'collection': self.collection1.id,
            'rarity': 'GOLD',
            'category': 'RARE',
        }
        response = self.client.post(reverse('card-list'), new_card_data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_card_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        new_card_data = {
            'name': 'Forbidden Card',
            'collection': self.collection1.id,
            'rarity': 'BRONZE',
            'category': 'COMMON',
        }
        response = self.client.post(reverse('card-list'), new_card_data, **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_card_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        updated_data = {
            'name': 'Updated Card',
            'collection': self.collection2.id,
            'rarity': 'PLATINUM',
            'category': 'EPIC',
        }
        response = self.client.put(reverse('card-detail', args=[self.card1.id]), updated_data, **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.card1.refresh_from_db()
        self.assertEqual(self.card1.name, 'Updated Card')

    def test_update_card_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        updated_data = {
            'name': 'Forbidden Update',
            'collection': self.collection2.id,
            'rarity': 'PLATINUM',
            'category': 'EPIC',
        }
        response = self.client.put(reverse('card-detail', args=[self.card1.id]), updated_data, **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_card_admin(self):
        headers = self.get_auth_headers(self.admin_user)
        response = self.client.delete(reverse('card-detail', args=[self.card3.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Card.objects.filter(id=self.card3.id).exists())

    def test_delete_card_regular_user_forbidden(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.delete(reverse('card-detail', args=[self.card1.id]), **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)