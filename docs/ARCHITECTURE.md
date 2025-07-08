# Architecture DeDepanne

## Vue d'ensemble

DeDepanne suit une architecture microservices moderne avec séparation claire entre le frontend et le backend.

## 🏗️ Architecture Globale

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Next.js)     │                  │   (NestJS)      │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ SQL
                                              ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Database      │
                                    └─────────────────┘
```

## 📱 Frontend (Next.js)

### Structure
```
frontend-dedepanne/
├── app/                          # App Router (Next.js 14)
│   ├── (auth)/                   # Routes d'authentification
│   ├── (dashboard)/              # Routes du tableau de bord
│   ├── api/                      # API Routes Next.js
│   └── globals.css               # Styles globaux
├── components/                    # Composants réutilisables
│   ├── ui/                       # Composants UI (shadcn/ui)
│   ├── forms/                    # Formulaires
│   └── layout/                   # Composants de mise en page
├── lib/                          # Utilitaires
│   ├── api.ts                    # Client API
│   ├── auth.ts                   # Gestion de l'authentification
│   └── utils.ts                  # Fonctions utilitaires
├── hooks/                        # Hooks React personnalisés
├── types/                        # Types TypeScript
└── public/                       # Assets statiques
```

### Technologies
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **Shadcn/ui** : Composants UI
- **React Hook Form** : Gestion des formulaires
- **Zustand** : Gestion d'état global
- **Axios** : Client HTTP

### Fonctionnalités principales
- Authentification utilisateur
- Interface de réservation de services
- Tableau de bord client/technicien
- Système de messagerie
- Gestion des paiements
- Notifications en temps réel

## 🔧 Backend (NestJS)

### Structure
```
backend-dedepanne/
├── src/
│   ├── auth/                     # Module d'authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── users/                    # Module utilisateurs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── user.entity.ts
│   ├── technicians/              # Module techniciens
│   │   ├── technicians.controller.ts
│   │   ├── technicians.service.ts
│   │   └── technician.entity.ts
│   ├── services/                 # Module services
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── service.entity.ts
│   ├── appointments/             # Module rendez-vous
│   │   ├── appointments.controller.ts
│   │   ├── appointments.service.ts
│   │   └── appointment.entity.ts
│   ├── payments/                 # Module paiements
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payment.entity.ts
│   ├── notifications/            # Module notifications
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notification.entity.ts
│   ├── common/                   # Utilitaires partagés
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/                   # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   └── main.ts                   # Point d'entrée
├── scripts/                      # Scripts utilitaires
│   ├── seed.ts                   # Script de seeding
│   └── migration.ts              # Scripts de migration
└── docker-compose.yml            # Configuration Docker
```

### Technologies
- **NestJS** : Framework Node.js
- **TypeScript** : Typage statique
- **TypeORM** : ORM pour PostgreSQL
- **JWT** : Authentification
- **Passport** : Stratégies d'authentification
- **Class-validator** : Validation des données
- **Swagger** : Documentation API

### API Endpoints

#### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `POST /auth/refresh` - Renouvellement du token
- `POST /auth/logout` - Déconnexion

#### Utilisateurs
- `GET /users/profile` - Profil utilisateur
- `PUT /users/profile` - Mise à jour du profil
- `GET /users/:id` - Détails d'un utilisateur

#### Techniciens
- `GET /technicians` - Liste des techniciens
- `GET /technicians/:id` - Détails d'un technicien
- `POST /technicians` - Créer un technicien
- `PUT /technicians/:id` - Mettre à jour un technicien

#### Services
- `GET /services` - Liste des services
- `GET /services/:id` - Détails d'un service
- `POST /services` - Créer un service
- `PUT /services/:id` - Mettre à jour un service

#### Rendez-vous
- `GET /appointments` - Liste des rendez-vous
- `GET /appointments/:id` - Détails d'un rendez-vous
- `POST /appointments` - Créer un rendez-vous
- `PUT /appointments/:id` - Mettre à jour un rendez-vous
- `DELETE /appointments/:id` - Annuler un rendez-vous

#### Paiements
- `POST /payments` - Créer un paiement
- `GET /payments/:id` - Détails d'un paiement
- `GET /payments` - Historique des paiements

## 🗄️ Base de données (PostgreSQL)

### Schéma principal

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role USER_ROLE DEFAULT 'CLIENT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Technicians
```sql
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  specializations TEXT[],
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Services
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  technician_id UUID REFERENCES technicians(id),
  service_id UUID REFERENCES services(id),
  scheduled_at TIMESTAMP NOT NULL,
  status APPOINTMENT_STATUS DEFAULT 'PENDING',
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method PAYMENT_METHOD,
  status PAYMENT_STATUS DEFAULT 'PENDING',
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Sécurité

### Authentification
- **JWT** pour l'authentification stateless
- **Refresh tokens** pour la sécurité
- **Hachage des mots de passe** avec bcrypt
- **Validation des données** avec class-validator

### Autorisation
- **Guards NestJS** pour la protection des routes
- **Rôles utilisateur** (CLIENT, TECHNICIAN, ADMIN)
- **Permissions granulaires** par endpoint

### CORS
- Configuration CORS pour le développement et la production
- Whitelist des domaines autorisés

## 🚀 Déploiement

### Environnements
- **Development** : Local avec hot reload
- **Staging** : Environnement de test
- **Production** : Serveur de production

### Docker
- **Multi-stage builds** pour optimiser les images
- **Docker Compose** pour l'orchestration
- **Volumes persistants** pour les données

### CI/CD
- **GitHub Actions** pour l'automatisation
- **Tests automatisés** à chaque commit
- **Déploiement automatique** sur staging/production

## 📊 Monitoring

### Logs
- **Winston** pour la gestion des logs
- **Structured logging** pour faciliter l'analyse
- **Log rotation** pour éviter la saturation

### Métriques
- **Health checks** pour la surveillance
- **Performance monitoring** avec Prometheus
- **Error tracking** avec Sentry

## 🔄 Workflow de développement

1. **Feature Branch** : Création d'une branche pour chaque fonctionnalité
2. **Code Review** : Revue de code obligatoire
3. **Tests** : Tests unitaires et d'intégration
4. **CI/CD** : Pipeline automatisé
5. **Deployment** : Déploiement automatique

## 📈 Évolutivité

### Scalabilité horizontale
- **Load balancing** pour distribuer la charge
- **Microservices** pour la modularité
- **Cache Redis** pour les performances

### Scalabilité verticale
- **Optimisation des requêtes** base de données
- **Compression** des réponses API
- **CDN** pour les assets statiques 