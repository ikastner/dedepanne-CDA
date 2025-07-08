# Tests Frontend - Dédépanne Next.js

## 🧪 Tests des Composants React

### **Test du Composant de Connexion**

```typescript
// __tests__/components/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock des services API
jest.mock('@/services/authService', () => ({
  login: jest.fn(),
}));

import { login } from '@/services/authService';

const mockLogin = login as jest.MockedFunction<typeof login>;

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('should render login form correctly', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'client',
    };

    mockLogin.mockResolvedValue({
      access_token: 'jwt-token-123',
      user: mockUser,
    });

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message for invalid credentials', async () => {
    mockLogin.mockRejectedValue(new Error('Identifiants invalides'));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
    });
  });

  it('should validate form fields', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    // Essayer de soumettre sans remplir les champs
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
    });
  });
});
```

### **Test du Composant de Demande de Réparation**

```typescript
// __tests__/components/RepairRequestForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RepairRequestForm } from '@/components/RepairRequestForm';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock des services
jest.mock('@/services/repairService', () => ({
  createRepairRequest: jest.fn(),
  getApplianceTypes: jest.fn(),
}));

import { createRepairRequest, getApplianceTypes } from '@/services/repairService';

const mockCreateRepairRequest = createRepairRequest as jest.MockedFunction<typeof createRepairRequest>;
const mockGetApplianceTypes = getApplianceTypes as jest.MockedFunction<typeof getApplianceTypes>;

describe('RepairRequestForm', () => {
  const mockApplianceTypes = [
    { id: 1, name: 'Lave-linge' },
    { id: 2, name: 'Lave-vaisselle' },
    { id: 3, name: 'Réfrigérateur' },
  ];

  beforeEach(() => {
    mockCreateRepairRequest.mockClear();
    mockGetApplianceTypes.mockResolvedValue(mockApplianceTypes);
  });

  it('should render form with appliance types', async () => {
    render(
      <AuthProvider>
        <RepairRequestForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/lave-linge/i)).toBeInTheDocument();
      expect(screen.getByText(/lave-vaisselle/i)).toBeInTheDocument();
    });
  });

  it('should submit repair request successfully', async () => {
    const mockRepairRequest = {
      id: 1,
      referenceCode: 'REP-2024-001',
      status: 'pending',
    };

    mockCreateRepairRequest.mockResolvedValue(mockRepairRequest);

    render(
      <AuthProvider>
        <RepairRequestForm />
      </AuthProvider>
    );

    // Remplir le formulaire
    await waitFor(() => {
      fireEvent.click(screen.getByText(/lave-linge/i));
    });

    fireEvent.change(screen.getByLabelText(/description du problème/i), {
      target: { value: 'Mon lave-linge fuit' },
    });

    fireEvent.change(screen.getByLabelText(/date souhaitée/i), {
      target: { value: '2024-02-15' },
    });

    fireEvent.click(screen.getByRole('button', { name: /soumettre/i }));

    await waitFor(() => {
      expect(mockCreateRepairRequest).toHaveBeenCalledWith({
        applianceTypeId: 1,
        issueDescription: 'Mon lave-linge fuit',
        scheduledDate: '2024-02-15',
      });
    });
  });

  it('should validate required fields', async () => {
    render(
      <AuthProvider>
        <RepairRequestForm />
      </AuthProvider>
    );

    // Soumettre sans remplir
    fireEvent.click(screen.getByRole('button', { name: /soumettre/i }));

    await waitFor(() => {
      expect(screen.getByText(/veuillez sélectionner un type d'appareil/i)).toBeInTheDocument();
      expect(screen.getByText(/la description est requise/i)).toBeInTheDocument();
    });
  });
});
```

### **Test du Composant de Catalogue de Produits**

```typescript
// __tests__/components/ProductCatalog.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCatalog } from '@/components/ProductCatalog';

// Mock des services
jest.mock('@/services/productService', () => ({
  getProducts: jest.fn(),
}));

import { getProducts } from '@/services/productService';

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

describe('ProductCatalog', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Lave-linge Samsung',
      price: 299.99,
      originalPrice: 499.99,
      savingsPercentage: 40,
      conditionRating: 'excellent',
      warrantyMonths: 12,
      imageUrl: '/images/lave-linge.jpg',
    },
    {
      id: 2,
      name: 'Réfrigérateur Bosch',
      price: 399.99,
      originalPrice: 699.99,
      savingsPercentage: 43,
      conditionRating: 'very_good',
      warrantyMonths: 6,
      imageUrl: '/images/refrigerateur.jpg',
    },
  ];

  beforeEach(() => {
    mockGetProducts.mockResolvedValue(mockProducts);
  });

  it('should render product catalog', async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      expect(screen.getByText(/lave-linge samsung/i)).toBeInTheDocument();
      expect(screen.getByText(/réfrigérateur bosch/i)).toBeInTheDocument();
    });
  });

  it('should display product information correctly', async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      expect(screen.getByText(/299,99 €/)).toBeInTheDocument();
      expect(screen.getByText(/499,99 €/)).toBeInTheDocument();
      expect(screen.getByText(/-40%/)).toBeInTheDocument();
      expect(screen.getByText(/garantie 12 mois/i)).toBeInTheDocument();
    });
  });

  it('should filter products by category', async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      fireEvent.click(screen.getByText(/lave-linge/i));
    });

    expect(screen.getByText(/lave-linge samsung/i)).toBeInTheDocument();
    expect(screen.queryByText(/réfrigérateur bosch/i)).not.toBeInTheDocument();
  });

  it('should add product to cart', async () => {
    const mockAddToCart = jest.fn();

    render(<ProductCatalog onAddToCart={mockAddToCart} />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('button', { name: /ajouter au panier/i })[0]);
    });

    expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});
```

## 🧪 Tests des Pages Next.js

### **Test de la Page d'Accueil**

```typescript
// __tests__/pages/index.test.tsx
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import HomePage from '@/pages/index';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('HomePage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      pathname: '/',
    } as any);
  });

  it('should render hero section', () => {
    render(<HomePage />);

    expect(screen.getByText(/dépannage d'électroménager/i)).toBeInTheDocument();
    expect(screen.getByText(/économie circulaire/i)).toBeInTheDocument();
  });

  it('should render service cards', () => {
    render(<HomePage />);

    expect(screen.getByText(/réparation/i)).toBeInTheDocument();
    expect(screen.getByText(/produits reconditionnés/i)).toBeInTheDocument();
    expect(screen.getByText(/don d'appareil/i)).toBeInTheDocument();
  });

  it('should navigate to services page', () => {
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      pathname: '/',
    } as any);

    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: /commencer/i }));

    expect(mockPush).toHaveBeenCalledWith('/services');
  });
});
```

### **Test de la Page de Services**

```typescript
// __tests__/pages/services.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import ServicesPage from '@/pages/services';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ServicesPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      pathname: '/services',
    } as any);
  });

  it('should render service selection', () => {
    render(<ServicesPage />);

    expect(screen.getByText(/choisissez votre service/i)).toBeInTheDocument();
    expect(screen.getByText(/réparation/i)).toBeInTheDocument();
    expect(screen.getByText(/achat reconditionné/i)).toBeInTheDocument();
  });

  it('should show repair form when repair is selected', () => {
    render(<ServicesPage />);

    fireEvent.click(screen.getByText(/réparation/i));

    expect(screen.getByText(/demande de réparation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type d'appareil/i)).toBeInTheDocument();
  });
});
```

## 🧪 Tests des Hooks Personnalisés

### **Test du Hook d'Authentification**

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock des services
jest.mock('@/services/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  getProfile: jest.fn(),
}));

import { login, logout, getProfile } from '@/services/authService';

const mockLogin = login as jest.MockedFunction<typeof login>;
const mockLogout = logout as jest.MockedFunction<typeof logout>;
const mockGetProfile = getProfile as jest.MockedFunction<typeof getProfile>;

describe('useAuth', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockLogout.mockClear();
    mockGetProfile.mockClear();
  });

  it('should provide authentication state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should handle login successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'client',
    };

    mockLogin.mockResolvedValue({
      access_token: 'jwt-token-123',
      user: mockUser,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle logout', async () => {
    mockLogout.mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLogout).toHaveBeenCalled();
  });
});
```

## 🧪 Tests d'Intégration Frontend

### **Test du Flux Complet de Connexion**

```typescript
// __tests__/integration/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/login';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Authentication Flow', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      pathname: '/login',
    } as any);
  });

  it('should complete full login flow', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' },
    });

    // Soumettre
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Vérifier la redirection
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

## 🚀 Configuration des Tests Frontend

### **Setup Jest pour Next.js**

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### **Setup des Tests**

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));
```

### **Scripts de Test Frontend**

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test"
  }
}
```

---

**Tests Frontend Dédépanne - Next.js + Testing Library** 🧪✅ 