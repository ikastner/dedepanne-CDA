# Système d'Authentification DeDepanne

## Vue d'ensemble

Le système d'authentification de DeDepanne utilise JWT (JSON Web Tokens) pour une authentification stateless et sécurisée.

## 🔐 Architecture d'Authentification

### Flux d'authentification

```
┌─────────────┐   1. Login    ┌─────────────┐   2. Validate   ┌─────────────┐
│   Client    │ ────────────► │   Backend   │ ──────────────► │ PostgreSQL  │
│  (Frontend) │               │  (NestJS)   │                │   Database  │
└─────────────┘               └─────────────┘                └─────────────┘
       │                              │                              │
       │ 3. JWT Token                 │                              │
       │                              │                              │
       ▼                              ▼                              ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│   Client    │               │   Backend   │               │ PostgreSQL  │
│  (Frontend) │               │  (NestJS)   │               │   Database  │
└─────────────┘               └─────────────┘               └─────────────┘
       │                              │                              │
       │ 4. API Requests              │                              │
       │ (with JWT)                   │                              │
       ▼                              ▼                              ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│   Client    │               │   Backend   │               │ PostgreSQL  │
│  (Frontend) │               │  (NestJS)   │               │   Database  │
└─────────────┘               └─────────────┘               └─────────────┘
```

## 🏗️ Structure Technique

### Backend (NestJS)

#### Modules d'authentification
```
src/
├── auth/
│   ├── auth.controller.ts          # Contrôleur d'authentification
│   ├── auth.service.ts             # Service d'authentification
│   ├── auth.module.ts              # Module d'authentification
│   ├── guards/
│   │   ├── jwt-auth.guard.ts      # Guard JWT
│   │   └── roles.guard.ts         # Guard des rôles
│   ├── strategies/
│   │   ├── jwt.strategy.ts        # Stratégie JWT
│   │   └── local.strategy.ts      # Stratégie locale
│   └── decorators/
│       └── roles.decorator.ts     # Décorateur des rôles
```

#### Entités utilisateur
```typescript
// src/modules/users/entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Frontend (Next.js)

#### Context d'authentification
```typescript
// lib/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

#### Hooks d'authentification
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 🔑 Endpoints d'API

### Authentification

#### POST /auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}
```

#### POST /auth/register
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

#### POST /auth/refresh
```typescript
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

#### POST /auth/logout
```typescript
interface LogoutRequest {
  refreshToken: string;
}
```

## 🛡️ Sécurité

### Hachage des mots de passe
- **Algorithme** : bcrypt
- **Salt rounds** : 12
- **Validation** : Minimum 8 caractères, majuscule, minuscule, chiffre

### JWT Configuration
```typescript
// Configuration JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '15m', // Access token
  },
  refreshOptions: {
    expiresIn: '7d', // Refresh token
  },
};
```

### Validation des données
```typescript
// DTO de connexion
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// DTO d'inscription
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
```

## 👥 Rôles et Permissions

### Rôles utilisateur
```typescript
export enum UserRole {
  CLIENT = 'CLIENT',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}
```

### Permissions par endpoint
```typescript
// Guards de rôles
@Roles(UserRole.ADMIN)
@Get('admin/users')
async getAllUsers() {
  // Seuls les admins peuvent accéder
}

@Roles(UserRole.TECHNICIAN, UserRole.ADMIN)
@Get('technicians/appointments')
async getTechnicianAppointments() {
  // Techniciens et admins
}

@Public()
@Get('public/services')
async getPublicServices() {
  // Accès public
}
```

## 🔄 Gestion des tokens

### Stockage côté client
```typescript
// lib/auth.ts
export const authStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
```

### Intercepteur HTTP
```typescript
// lib/api/client.ts
api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de le renouveler
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          authStorage.setTokens(
            response.data.accessToken,
            response.data.refreshToken
          );
          // Retry la requête originale
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh échoué, déconnexion
          authStorage.clearTokens();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Tests

### Tests unitaires
```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user credentials', async () => {
    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toBeDefined();
  });
});
```

### Tests d'intégration
```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user).toBeDefined();
      });
  });
});
```

## 📊 Monitoring et Logs

### Logs d'authentification
```typescript
// Logs des tentatives de connexion
logger.log(`Login attempt for user: ${email}`);

// Logs des échecs d'authentification
logger.warn(`Failed login attempt for user: ${email}`);

// Logs des renouvellements de token
logger.log(`Token refreshed for user: ${userId}`);
```

### Métriques
- Nombre de tentatives de connexion
- Taux de réussite des connexions
- Temps de réponse des endpoints d'auth
- Nombre de tokens expirés

## 🔧 Configuration

### Variables d'environnement
```env
# Backend
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Configuration de production
```typescript
// Production settings
const productionConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '15m',
    },
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite par IP
  },
};
```

## 🚀 Déploiement

### Sécurité en production
1. **HTTPS obligatoire** pour tous les endpoints
2. **Rate limiting** sur les endpoints d'auth
3. **Validation stricte** des tokens
4. **Rotation des secrets** JWT
5. **Monitoring** des tentatives d'intrusion

### Migration des données
```sql
-- Migration pour ajouter les rôles
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'CLIENT';

-- Index pour les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
``` 