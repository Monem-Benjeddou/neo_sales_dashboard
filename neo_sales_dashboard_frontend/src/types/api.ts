export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface DashboardKpiData {
  avgOrderValue: number;
  totalCreatedCards: number;
  totalCollectionsCreated: number;
  totalUsersAccount: number;
  salesOvertime: { month: string; value: number }[];
  latestOrders: Order[];
  metricsGrowth: {
    avgOrderValueGrowth: string;
    totalCollectionsGrowth: string;
    totalUsersGrowth: string;
    newCardsCount: number;
  };
}

export interface CollectionListItem {
  collectionId: number;
  collectionName: string;
  issuerName: string | null;
  expectedReleaseDate: string | null; // Formatted as DD/MM/YYYY
  numberOfCardDesigns: number;
  category: 'Esport' | 'Gaming' | 'Art' | 'Sports' | 'Other';
  status: 'Pending' | 'InProduction' | 'Issued' | 'Public';
}

export interface Collection {
  id: number;
  name: string;
  status: 'PENDING' | 'IN_PRODUCTION' | 'ISSUED' | 'PUBLIC';
  expectedReleaseDate: string | null; // YYYY-MM-DD
  issuerName: string | null;
  category: 'ESPORT' | 'GAMING' | 'ART' | 'SPORTS' | 'OTHER';
  createdAt: string;
  updatedAt: string;
  numberOfCardDesigns: number;
  statusDisplay: string;
  categoryDisplay: string;
}

export interface Card {
  id: number;
  collection: Collection; // Nested collection object
  name: string;
  category: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  rarity: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  user: UserProfile; // Nested user object
  orderValue: string; // Decimal field from Django
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  statusDisplay: string;
  orderDate: string; // ISO 8601 datetime string
  orderDateFormatted: string;
  updatedAt: string;
}

// Request Bodies
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface CreateCollectionRequest {
  name: string;
  status: 'PENDING' | 'IN_PRODUCTION' | 'ISSUED' | 'PUBLIC';
  expectedReleaseDate?: string | null; // YYYY-MM-DD
  issuerName?: string | null;
  category: 'ESPORT' | 'GAMING' | 'ART' | 'SPORTS' | 'OTHER';
}

export interface UpdateCollectionRequest {
  name?: string;
  status?: 'PENDING' | 'IN_PRODUCTION' | 'ISSUED' | 'PUBLIC';
  expectedReleaseDate?: string | null;
  issuerName?: string | null;
  category?: 'ESPORT' | 'GAMING' | 'ART' | 'SPORTS' | 'OTHER';
}

export interface CreateCardRequest {
  collection: number; // ID of the collection
  name: string;
  category: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  rarity: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface UpdateCardRequest {
  collection?: number;
  name?: string;
  category?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  rarity?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface CreateOrderRequest {
  user: number; // ID of the user
  orderValue: number;
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateOrderRequest {
  user?: number;
  orderValue?: number;
  status?: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: any;
}
