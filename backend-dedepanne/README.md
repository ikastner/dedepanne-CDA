# Backend Dédépanne - API NestJS

Backend complet pour la plateforme Dédépanne, développé avec NestJS et conforme au PRD v2.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Authentification** : JWT avec rôles (client, technicien, admin)
- **Utilisateurs** : Gestion des profils et adresses
- **Réparations** : Demandes, interventions, historique
- **Produits** : Catalogue reconditionné, commandes
- **Dons** : Gestion des dons d'appareils
- **Logs** : Système de logs MongoDB
- **Documentation** : Swagger/OpenAPI

### 📊 Architecture

#### Base de données
- **PostgreSQL** : Données principales
- **MongoDB** : Logs structurés

#### Modules
- `auth` : Authentification JWT
- `users` : Gestion des utilisateurs
- `repairs` : Réparations et interventions
- `products` : Produits reconditionnés
- `donations` : Dons d'appareils
- `logs` : Système de logs

## 🛠️ Installation

### Prérequis
- Node.js 18+
- PostgreSQL 15+
- MongoDB 5+

### Installation

1. **Cloner le projet**
```bash
git clone <repository>
cd backend-dedepanne
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
```bash
cp env.example .env
# Éditer .env avec vos paramètres
```

4. **Base de données**
```bash
# Créer la base PostgreSQL
createdb dedepanne

# Démarrer MongoDB
mongod
```

5. **Démarrer l'application**
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

L'API est documentée avec Swagger :
- **URL** : `http://localhost:3001/api/docs`
- **Authentification** : Bearer Token JWT

### Endpoints principaux

#### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/profile` - Profil utilisateur

#### Réparations
- `POST /repairs` - Créer une demande
- `GET /repairs` - Lister les demandes
- `GET /repairs/:id` - Détails d'une demande
- `POST /repairs/:id/interventions` - Créer une intervention
- `PUT /repairs/interventions/:id/finalize` - Finaliser une intervention

#### Produits
- `GET /products` - Catalogue des produits
- `POST /products/orders` - Créer une commande
- `GET /products/orders/:id` - Détails d'une commande

#### Dons
- `POST /donations` - Créer un don
- `GET /donations` - Lister les dons

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=dedepanne

# MongoDB
MONGODB_URI=mongodb://localhost:27017

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📦 Scripts disponibles

```bash
npm run build          # Compiler le projet
npm run start          # Démarrer en mode production
npm run start:dev      # Démarrer en mode développement
npm run start:debug    # Démarrer en mode debug
npm run test           # Lancer les tests
npm run test:watch     # Tests en mode watch
npm run test:cov       # Tests avec coverage
```

## 🏗️ Structure du projet

```
src/
├── config/           # Configuration
├── database/         # Entités TypeORM
│   └── entities/
├── modules/          # Modules métier
│   ├── auth/         # Authentification
│   ├── users/        # Utilisateurs
│   ├── repairs/      # Réparations
│   ├── products/     # Produits
│   ├── donations/    # Dons
│   └── logs/         # Logs
├── guards/           # Guards d'authentification
├── interfaces/       # Interfaces TypeScript
└── main.ts          # Point d'entrée
```

## 🔒 Sécurité

- **JWT** : Authentification sécurisée
- **Validation** : DTOs avec class-validator
- **CORS** : Configuration sécurisée
- **Rate Limiting** : Protection contre les abus
- **Logs** : Audit trail complet

## 📈 Monitoring

- **Logs** : Winston + MongoDB
- **Métriques** : Prometheus (à implémenter)
- **Health Checks** : Endpoints de santé

## 🚀 Déploiement

### Docker
```bash
docker build -t dedepanne-backend .
docker run -p 3001:3001 dedepanne-backend
```

### Production
```bash
npm run build
npm run start:prod
```

## 📝 Licence

MIT License - Voir LICENSE pour plus de détails.

---

**Dédépanne** - Transformer le dépannage en service circulaire durable 🌱 