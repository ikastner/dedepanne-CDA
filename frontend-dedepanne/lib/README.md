# Architecture du dossier `lib` - Méthodologie unifiée

## Vue d'ensemble

Cette architecture suit la méthodologie de l'authentification qui fonctionne parfaitement. Tous les domaines utilisent la même approche :

1. **Client API centralisé** (`api/client.ts`)
2. **Contexts React** pour la gestion d'état
3. **Pas de services séparés** - tout passe par le client API
4. **Pas de hooks séparés** - les hooks sont dans les contexts

## Structure

```
lib/
├── api/
│   └── client.ts          # Client API centralisé avec toutes les méthodes
├── contexts/
│   ├── AuthContext.tsx    # Authentification (fonctionne déjà)
│   ├── ProductsContext.tsx # Produits reconditionnés
│   ├── RepairsContext.tsx # Réparations
│   ├── DonationsContext.tsx # Dons
│   ├── AppProvider.tsx    # Provider principal qui combine tous les contexts
│   └── index.ts           # Exports de tous les contexts
├── config.ts              # Configuration
├── constants.ts           # Constantes
└── utils.ts              # Utilitaires
```

## Méthodologie unifiée

### 1. Client API (`api/client.ts`)

Toutes les méthodes API sont centralisées dans un seul client :

```typescript
class ApiClient {
  // Méthodes d'authentification
  async login(credentials) { ... }
  async register(userData) { ... }
  async getProfile() { ... }

  // Méthodes pour les produits (publiques)
  async getPublicProducts(search?, category?, brand?) { ... }
  async getPublicProduct(id) { ... }

  // Méthodes pour les réparations (privées)
  async getRepairs() { ... }
  async createRepair(data) { ... }
  async updateRepair(id, data) { ... }

  // Méthodes pour les dons (privées)
  async getDonations() { ... }
  async createDonation(data) { ... }
}
```

### 2. Contexts React

Chaque domaine a son context qui suit le même pattern que `AuthContext` :

```typescript
interface ProductsContextType {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
}
```

### 3. Provider principal (`AppProvider.tsx`)

Combine tous les contexts dans l'ordre correct :

```typescript
export const AppProvider = ({ children }) => (
  <AuthProvider>
    <ProductsProvider>
      <RepairsProvider>
        <DonationsProvider>
          {children}
        </DonationsProvider>
      </RepairsProvider>
    </ProductsProvider>
  </AuthProvider>
);
```

## Utilisation dans les composants

### Avant (méthodologie chaotique)
```typescript
// ❌ Gestion d'état locale + appels API directs
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await apiClient.getPublicProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchProducts();
}, []);
```

### Après (méthodologie unifiée)
```typescript
// ✅ Context centralisé
const { products, loading, error, fetchProducts } = useProducts();

// Les données sont automatiquement récupérées et gérées par le context
```

## Avantages de cette architecture

1. **Cohérence** : Tous les domaines suivent la même méthodologie
2. **Maintenabilité** : Code centralisé et organisé
3. **Réutilisabilité** : Les contexts peuvent être utilisés partout
4. **Performance** : État partagé entre les composants
5. **Debugging** : Logs centralisés et cohérents
6. **Authentification** : Gestion automatique des tokens

## Migration terminée

- ✅ Suppression des services séparés (`services/`)
- ✅ Suppression des hooks séparés (`api/hooks.ts`)
- ✅ Création des contexts unifiés
- ✅ Mise à jour des pages pour utiliser les contexts
- ✅ Provider principal configuré
- ✅ Architecture cohérente avec l'authentification

## Prochaines étapes

1. Tester tous les contexts
2. Ajouter des contexts pour d'autres domaines si nécessaire
3. Optimiser les performances si besoin
4. Ajouter des tests unitaires 