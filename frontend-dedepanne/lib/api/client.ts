const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log(`API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Méthodes pour les réparations
  async createRepair(data: any) {
    return this.request('/repairs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRepairs() {
    return this.request('/repairs');
  }

  async getRepair(id: string) {
    return this.request(`/repairs/${id}`);
  }

  async updateRepair(id: string, data: any) {
    return this.request(`/repairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Méthodes pour les dons
  async createDonation(data: any) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDonations() {
    return this.request('/donations');
  }

  // Méthodes pour les produits reconditionnés (privées - nécessitent authentification)
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Méthodes pour les produits reconditionnés (publiques - pas d'authentification)
  async getPublicProducts(search?: string, category?: string, brand?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (brand) params.append('brand', brand);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/public/products?${queryString}` : '/public/products';
    
    return this.request(endpoint);
  }

  async getPublicProduct(id: string) {
    return this.request(`/public/products/${id}`);
  }

  // Méthodes d'authentification
  async login(credentials: { email: string; password: string }) {
    console.log('Login attempt with:', credentials.email);
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('Login response:', response);
    return response;
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    console.log('Getting user profile...');
    const response = await this.request('/auth/profile');
    console.log('Profile response:', response);
    return response;
  }

  // Méthodes pour les utilisateurs
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Méthodes pour les commandes
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Méthodes pour les réparations de l'utilisateur
  async getUserRepairs() {
    return this.request('/repairs');
  }

  // Méthodes pour les commandes de l'utilisateur
  async getUserOrders() {
    return this.request('/orders');
  }

  // Méthodes pour les donations de l'utilisateur
  async getUserDonations() {
    return this.request('/donations');
  }
}

export const apiClient = new ApiClient(); 