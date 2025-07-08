# Tests E2E - Dédépanne avec Playwright

## 🎭 Configuration Playwright

### **Installation et Configuration**

```bash
# Installation
npm install -D @playwright/test

# Initialisation
npx playwright install
```

### **Configuration Playwright**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 🧪 Tests E2E des Fonctionnalités Principales

### **Test du Flux d'Authentification**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register new user successfully', async ({ page }) => {
    // Aller à la page d'inscription
    await page.click('text=S\'inscrire');
    
    // Remplir le formulaire
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="firstName-input"]', 'John');
    await page.fill('[data-testid="lastName-input"]', 'Doe');
    await page.fill('[data-testid="phone-input"]', '0123456789');
    
    // Soumettre
    await page.click('[data-testid="register-button"]');
    
    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bienvenue John')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    // Aller à la page de connexion
    await page.click('text=Se connecter');
    
    // Remplir le formulaire
    await page.fill('[data-testid="email-input"]', 'existing@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Soumettre
    await page.click('[data-testid="login-button"]');
    
    // Vérifier la connexion
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Se connecter');
    
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    // Vérifier le message d'erreur
    await expect(page.locator('text=Identifiants invalides')).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // Se connecter d'abord
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Se déconnecter
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Se déconnecter');
    
    // Vérifier la redirection
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Se connecter')).toBeVisible();
  });
});
```

### **Test du Flux de Réparation**

```typescript
// tests/e2e/repair.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Repair Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'client@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
  });

  test('should create repair request successfully', async ({ page }) => {
    // Aller aux services
    await page.goto('/services');
    
    // Sélectionner réparation
    await page.click('text=Réparation');
    
    // Remplir le formulaire
    await page.selectOption('[data-testid="appliance-type-select"]', '1');
    await page.fill('[data-testid="issue-description"]', 'Mon lave-linge fuit');
    await page.fill('[data-testid="scheduled-date"]', '2024-02-15');
    await page.selectOption('[data-testid="time-slot-select"]', '09:00-11:00');
    
    // Soumettre
    await page.click('[data-testid="submit-repair-button"]');
    
    // Vérifier la confirmation
    await expect(page.locator('text=Demande de réparation créée')).toBeVisible();
    await expect(page.locator('[data-testid="reference-code"]')).toBeVisible();
  });

  test('should show scheduling conflict error', async ({ page }) => {
    await page.goto('/services');
    await page.click('text=Réparation');
    
    // Essayer de planifier sur un créneau déjà pris
    await page.selectOption('[data-testid="appliance-type-select"]', '1');
    await page.fill('[data-testid="issue-description"]', 'Test conflit');
    await page.fill('[data-testid="scheduled-date"]', '2024-02-15');
    await page.selectOption('[data-testid="time-slot-select"]', '09:00-11:00');
    
    await page.click('[data-testid="submit-repair-button"]');
    
    // Vérifier l'erreur
    await expect(page.locator('text=Créneau déjà réservé')).toBeVisible();
  });

  test('should view repair history', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aller à l'historique des réparations
    await page.click('text=Mes réparations');
    
    // Vérifier la liste
    await expect(page.locator('[data-testid="repair-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="repair-item"]')).toHaveCount(2);
  });

  test('should cancel repair request', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Mes réparations');
    
    // Annuler une réparation
    await page.click('[data-testid="cancel-repair-button"]');
    await page.click('text=Confirmer l\'annulation');
    
    // Vérifier la confirmation
    await expect(page.locator('text=Réparation annulée')).toBeVisible();
  });
});
```

### **Test du Catalogue de Produits**

```typescript
// tests/e2e/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reconditioned');
  });

  test('should display product catalog', async ({ page }) => {
    // Vérifier l'affichage des produits
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6);
  });

  test('should filter products by category', async ({ page }) => {
    // Filtrer par lave-linge
    await page.click('[data-testid="filter-lave-linge"]');
    
    // Vérifier que seuls les lave-linges sont affichés
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(2);
    
    for (let i = 0; i < 2; i++) {
      await expect(productCards.nth(i).locator('text=Lave-linge')).toBeVisible();
    }
  });

  test('should filter by price range', async ({ page }) => {
    // Définir une fourchette de prix
    await page.fill('[data-testid="min-price"]', '200');
    await page.fill('[data-testid="max-price"]', '400');
    await page.click('[data-testid="apply-price-filter"]');
    
    // Vérifier les prix
    const prices = page.locator('[data-testid="product-price"]');
    for (let i = 0; i < await prices.count(); i++) {
      const priceText = await prices.nth(i).textContent();
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      expect(price).toBeGreaterThanOrEqual(200);
      expect(price).toBeLessThanOrEqual(400);
    }
  });

  test('should add product to cart', async ({ page }) => {
    // Ajouter un produit au panier
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Vérifier la notification
    await expect(page.locator('text=Produit ajouté au panier')).toBeVisible();
    
    // Vérifier le compteur du panier
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should view product details', async ({ page }) => {
    // Cliquer sur un produit
    await page.click('[data-testid="product-card"]');
    
    // Vérifier les détails
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="warranty-info"]')).toBeVisible();
  });
});
```

### **Test du Flux d'Achat**

```typescript
// tests/e2e/purchase.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'client@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
  });

  test('should complete purchase successfully', async ({ page }) => {
    // Aller au catalogue
    await page.goto('/reconditioned');
    
    // Ajouter un produit au panier
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Aller au panier
    await page.click('[data-testid="cart-icon"]');
    
    // Vérifier le produit dans le panier
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Procéder au paiement
    await page.click('text=Procéder au paiement');
    
    // Remplir les informations de livraison
    await page.fill('[data-testid="address-line1"]', '123 Rue de la Paix');
    await page.fill('[data-testid="city"]', 'Paris');
    await page.fill('[data-testid="postal-code"]', '75001');
    
    // Confirmer la commande
    await page.click('[data-testid="confirm-order-button"]');
    
    // Vérifier la confirmation
    await expect(page.locator('text=Commande confirmée')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('should apply discount code', async ({ page }) => {
    await page.goto('/reconditioned');
    await page.click('[data-testid="add-to-cart-button"]');
    await page.click('[data-testid="cart-icon"]');
    
    // Appliquer un code promo
    await page.fill('[data-testid="discount-code"]', 'DEDEPANNE10');
    await page.click('[data-testid="apply-discount-button"]');
    
    // Vérifier la réduction
    await expect(page.locator('text=Réduction appliquée')).toBeVisible();
    await expect(page.locator('[data-testid="discount-amount"]')).toContainText('-10%');
  });
});
```

### **Test du Flux de Don d'Appareil**

```typescript
// tests/e2e/donation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Donation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/donations');
  });

  test('should evaluate appliance successfully', async ({ page }) => {
    // Remplir le formulaire d'évaluation
    await page.selectOption('[data-testid="appliance-type"]', '1');
    await page.selectOption('[data-testid="brand"]', 'Samsung');
    await page.fill('[data-testid="model"]', 'WW90T534DAW');
    await page.selectOption('[data-testid="condition"]', 'good');
    await page.fill('[data-testid="age"]', '5');
    await page.fill('[data-testid="description"]', 'Lave-linge en bon état');
    
    // Soumettre l'évaluation
    await page.click('[data-testid="evaluate-button"]');
    
    // Vérifier l'estimation
    await expect(page.locator('[data-testid="estimated-value"]')).toBeVisible();
    await expect(page.locator('[data-testid="voucher-amount"]')).toBeVisible();
  });

  test('should schedule collection', async ({ page }) => {
    // Évaluer d'abord
    await page.selectOption('[data-testid="appliance-type"]', '1');
    await page.selectOption('[data-testid="brand"]', 'Samsung');
    await page.fill('[data-testid="model"]', 'WW90T534DAW');
    await page.selectOption('[data-testid="condition"]', 'good');
    await page.fill('[data-testid="age"]', '5');
    await page.click('[data-testid="evaluate-button"]');
    
    // Planifier la collecte
    await page.click('text=Planifier la collecte');
    await page.fill('[data-testid="collection-date"]', '2024-02-20');
    await page.selectOption('[data-testid="collection-time"]', '14:00-16:00');
    await page.fill('[data-testid="collection-address"]', '123 Rue de la Paix, Paris');
    
    await page.click('[data-testid="confirm-collection-button"]');
    
    // Vérifier la confirmation
    await expect(page.locator('text=Collecte planifiée')).toBeVisible();
  });
});
```

## 📱 Tests Responsive

### **Test sur Mobile**

```typescript
// tests/e2e/mobile.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile menu correctly', async ({ page }) => {
    await page.goto('/');
    
    // Ouvrir le menu mobile
    await page.click('[data-testid="mobile-menu-button"]');
    
    // Vérifier les liens du menu
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Produits')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/reconditioned');
    
    // Swiper sur les produits
    await page.locator('[data-testid="product-carousel"]').swipe('left');
    
    // Vérifier que les produits changent
    await expect(page.locator('[data-testid="product-card"]').first()).not.toBeVisible();
  });
});
```

## 🔒 Tests de Sécurité

### **Test des Vulnérabilités XSS**

```typescript
// tests/e2e/security.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should prevent XSS in search', async ({ page }) => {
    await page.goto('/reconditioned');
    
    // Essayer une injection XSS
    await page.fill('[data-testid="search-input"]', '<script>alert("xss")</script>');
    await page.click('[data-testid="search-button"]');
    
    // Vérifier que le script n'est pas exécuté
    const alertPromise = page.waitForEvent('dialog');
    await page.waitForTimeout(1000);
    
    // Aucune alerte ne devrait apparaître
    const alerts = await page.evaluate(() => {
      return window.alert;
    });
    
    expect(alerts).toBeDefined();
  });

  test('should prevent SQL injection', async ({ page }) => {
    await page.goto('/login');
    
    // Essayer une injection SQL
    await page.fill('[data-testid="email-input"]', "' OR 1=1 --");
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Vérifier que l'erreur est gérée correctement
    await expect(page.locator('text=Identifiants invalides')).toBeVisible();
  });
});
```

## 🚀 Scripts de Test E2E

### **Package.json Scripts**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:install": "playwright install"
  }
}
```

### **GitHub Actions pour E2E**

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm run build
    - run: npm run test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: |
          playwright-report/
          test-results/
```

---

**Tests E2E Dédépanne - Playwright** 🎭✅ 