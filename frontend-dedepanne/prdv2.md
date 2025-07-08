# PRD - DÉDÉPANNE (V2)

## 🌟 VISION ET OBJECTIFS

### Vision
Dédépanne est une plateforme circulaire de réparation et de reconditionnement d'électroménager, connectant techniciens indépendants et clients pour prolonger la durée de vie des appareils et réduire les déchets électroniques.

### Objectifs
- Réduire les déchets électroménagers de 30% en 3 ans
- Offrir un accès élargi à des produits reconditionnés
- Valoriser les compétences des techniciens de terrain
- Créer un modèle durable, social et économiquement viable

## 👥 UTILISATEURS CIBLES

### 1. Clients

#### Marie, 35 ans - Mère de famille éco-responsable
- **Profil** : Famille avec 2 enfants, soucieuse de l'environnement
- **Besoin** : Réparer son lave-linge plutôt que d'en acheter un neuf
- **Motivation** : Économies + impact environnemental

#### Jean, 28 ans - Étudiant en colocation
- **Profil** : Budget limité, logement partagé
- **Besoin** : Électroménager fiable à prix abordable
- **Motivation** : Économies + praticité

### 2. Techniciens indépendants

#### Sophie, 45 ans - Technicienne de maintenance
- **Profil** : Expérience en réparation, cherche emploi stable
- **Besoin** : Plateforme pour développer son activité
- **Motivation** : Revenus stables + valorisation de ses compétences

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technique Validée

#### Backend (✅ Implémenté)
- **Framework** : NestJS 10.x
- **Base de données** : PostgreSQL 15 (production) + SQLite (développement)
- **ORM** : TypeORM avec migrations
- **Authentification** : JWT + Passport
- **Validation** : class-validator + class-transformer
- **Documentation** : Swagger/OpenAPI
- **Logs** : Winston + MongoDB (table `application_logs`)
- **Tests** : Jest + Supertest

#### Frontend (🔄 En développement)
- **Framework** : Next.js 14 avec App Router
- **UI** : Tailwind CSS + shadcn/ui
- **État** : Zustand
- **Formulaires** : React Hook Form + Zod
- **Cartes** : Mapbox ou Google Maps

#### Infrastructure
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Monitoring** : Prometheus + Grafana
- **Logs** : MongoDB (NoSQL)

## 📊 MODÈLE DE DONNÉES (MISE À JOUR MCD)

### Tables Principales

#### 1. Utilisateurs et Authentification
```sql
-- Utilisateurs (clients, admins, techniciens)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin', 'technician') DEFAULT 'client',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adresses des clients
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    department VARCHAR(3) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);
```

#### 2. Réparations
```sql
-- Demandes de réparation
CREATE TABLE repair_requests (
    id SERIAL PRIMARY KEY,
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    appliance_type_id INTEGER NOT NULL REFERENCES appliance_types(id),
    brand_id INTEGER REFERENCES appliance_brands(id),
    model VARCHAR(100),
    issue_description TEXT NOT NULL,
    status ENUM('pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    base_price DECIMAL(8,2) NOT NULL,
    additional_cost DECIMAL(8,2) DEFAULT 0,
    total_cost DECIMAL(8,2) NOT NULL,
    scheduled_date DATE,
    scheduled_time_slot VARCHAR(20),
    technician_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Produits Reconditionnés
```sql
-- Produits reconditionnés
CREATE TABLE reconditioned_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    appliance_type_id INTEGER NOT NULL REFERENCES appliance_types(id),
    brand_id INTEGER NOT NULL REFERENCES appliance_brands(id),
    model VARCHAR(100),
    price DECIMAL(8,2) NOT NULL,
    original_price DECIMAL(8,2) NOT NULL,
    savings_percentage DECIMAL(5,2) NOT NULL,
    condition_rating ENUM('excellent', 'very_good', 'good', 'fair') NOT NULL,
    warranty_months INTEGER NOT NULL,
    features JSON,
    description TEXT,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tables d'historique spécifiques

#### HistoriqueDemande
- statut (ex: "en attente", "validée", "en cours", "terminée")
- date
- commentaire
- technicien (optionnel)

#### HistoriqueIntervention
- statut
- date
- commentaire
- prochaine action

#### HistoriqueCommande
- étape (ex: "confirmée", "expédiée", "livrée")
- date
- transporteur
- numéro de suivi
- commentaire

#### HistoriqueDon
- étape ("collecté", "trié", "remis")
- date
- lieu
- commentaire

Chaque historique est lié à une entité mère via une association "Concerne" avec cardinalités 1,1 - 1,n.

#### 4. Logs d'Application (MongoDB)
```javascript
// Collection logs dans MongoDB
{
  level: "error|warn|info|debug",
  category: "auth|repair|product|donation|system",
  message: "Message du log",
  metadata: { /* Données flexibles */ },
  userId: ObjectId,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  endpoint: "/api/v1/auth/login",
  method: "POST",
  errorDetails: {
    name: "Error",
    message: "Error message",
    stack: "Stack trace"
  },
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

## 🚀 FONCTIONNALITÉS CLÉS (REVUES)

### Modules Backend (NestJS)

#### 1. Authentification (✅ Fonctionnel)
- **Inscription** : POST `/api/v1/auth/register`
- **Connexion** : POST `/api/v1/auth/login`
- **Profil** : GET `/api/v1/auth/profile`
- **JWT** : Tokens sécurisés avec expiration
- **Rôles** : client, admin, technician

#### 2. Utilisateurs (✅ Implémenté)
- **CRUD** complet des utilisateurs
- **Gestion des rôles** et permissions
- **Validation** des données
- **Pagination** et filtres

#### 3. Réparations (🔄 En développement)
- **Demandes** de réparation
- **Planification** des interventions
- **Suivi** en temps réel via HistoriqueIntervention
- **Facturation** automatique

#### 4. Produits (🔄 En développement)
- **Catalogue** de produits reconditionnés
- **Gestion** des stocks
- **Évaluations** et avis
- **Images** et descriptions

#### 5. Dons (🔄 En développement)
- **Collecte** d'appareils usagés
- **Évaluation** de la valeur
- **Bon d'achat** automatique
- **Suivi** via HistoriqueDon

#### 6. Logs (✅ Implémenté - MongoDB)
- **Logs** structurés en MongoDB
- **Niveaux** : error, warn, info, debug
- **Catégories** : auth, repair, product, donation, system
- **Métadonnées** JSON flexibles
- **Recherche** et agrégations avancées

### Workflows Métier

#### Réparation (Workflow)
1. Client déclare un problème
2. Demande de réparation créée (avec suivi d'étapes via HistoriqueDemande)
3. Planification de l'intervention
4. Technicien renseigne HistoriqueIntervention à chaque passage
5. Finalisation et facture

#### Produit reconditionné
1. Ajout / modification du stock
2. Fiches produits avec état, prix, garantie, image, etc.
3. Commande client avec HistoriqueCommande

#### Don
1. Proposition par le client
2. Enlèvement par le technicien
3. Suivi via HistoriqueDon

## 🎨 SYSTÈME DE DESIGN

### Identité Visuelle
- **Couleurs** : Vert (#10B981) + Bleu (#3B82F6)
- **Typographie** : Inter + Poppins
- **Icônes** : Lucide React
- **Style** : Moderne, accessible, professionnel

### Composants UI
- **Boutons** : Primary, Secondary, Danger
- **Formulaires** : Validation en temps réel
- **Cartes** : Produits, réparations, dons
- **Navigation** : Responsive, intuitive

## 📱 PARCOURS UTILISATEUR

### 1. Dépannage
1. **Diagnostic** en ligne (chatbot IA)
2. **Devis** instantané
3. **Planification** de l'intervention
4. **Suivi** en temps réel via HistoriqueIntervention
5. **Paiement** sécurisé

### 2. Achat Reconditionné
1. **Catalogue** filtré par type/marque
2. **Filtres** avancés (prix, garantie, état)
3. **Détails** complets + photos
4. **Livraison** + installation
5. **Garantie** étendue

### 3. Don d'Appareil
1. **Évaluation** en ligne
2. **Planification** de collecte
3. **Bon d'achat** automatique
4. **Suivi** du reconditionnement via HistoriqueDon
5. **Impact** environnemental

## 🔒 SÉCURITÉ ET CONFORMITÉ

### Authentification
- **JWT** avec expiration
- **Refresh tokens** sécurisés
- **Rate limiting** par IP
- **Validation** stricte des données

### Données
- **Chiffrement** des mots de passe (bcrypt)
- **RGPD** compliant
- **Backup** automatique
- **Audit trail** complet via logs MongoDB

## 📊 KPIs (Actualisés)

### Techniques
- **Uptime** : 99.9%
- **Temps de réponse** : <200ms
- **Taux d'erreur** : <0.1%
- **Performance** : Lighthouse >90

### Business
- **Nombre de réparations validées**
- **Taux de réussite d'intervention**
- **Délais entre prise de contact et intervention**
- **Taux de satisfaction client**
- **Volume de dons et produits reconditionnés**

## 🛌 REMARQUES TECHNIQUES

- L'application technicien est monoutil (pas multi-agent)
- Historique lié uniquement au technicien connecté
- Les interfaces frontend affichent des timelines à partir des tables Historique...
- Aucun champ "agent" ou "utilisateur créateur" requis dans les historiques pour l'instant
- Version actualisée conforme au MCD final

## 🚀 ROADMAP

### Phase 1 - MVP (✅ Terminé)
- [x] Backend NestJS avec authentification
- [x] Base de données PostgreSQL
- [x] API REST documentée (Swagger)
- [x] Système de logs MongoDB
- [x] Docker + déploiement

### Phase 2 - Fonctionnalités Core (🔄 En cours)
- [ ] Module réparations complet
- [ ] Module produits reconditionnés
- [ ] Module dons d'appareils
- [ ] Frontend Next.js
- [ ] Système de paiement

### Phase 3 - Avancé (📅 Q2 2024)
- [ ] IA pour diagnostic
- [ ] Application mobile
- [ ] Marketplace techniciens
- [ ] Analytics avancés
- [ ] Intégrations tierces

### Phase 4 - Écosystème (📅 Q3 2024)
- [ ] API publique
- [ ] Partenariats
- [ ] Expansion géographique
- [ ] Services B2B
- [ ] Certification ISO

## 💰 MODÈLE ÉCONOMIQUE

### Revenus
- **Commission** réparations : 15%
- **Marge** produits reconditionnés : 30%
- **Services** premium : 50€/mois
- **Formation** techniciens : 200€/session

### Coûts
- **Développement** : 50k€/an
- **Infrastructure** : 5k€/an
- **Marketing** : 20k€/an
- **Support** : 15k€/an

### Projections
- **Année 1** : 100k€ CA, -20k€ résultat
- **Année 2** : 300k€ CA, +50k€ résultat
- **Année 3** : 800k€ CA, +200k€ résultat

## 🛠️ DÉVELOPPEMENT ET MAINTENANCE

### Environnements
- **Développement** : Local + Docker
- **Staging** : Serveur de test
- **Production** : Cloud scalable

### Qualité
- **Tests** unitaires : >80% coverage
- **Tests** d'intégration : Automatisés
- **Code review** : Obligatoire
- **Documentation** : À jour

### Monitoring
- **Logs** MongoDB structurés
- **Métriques** temps réel
- **Alertes** automatiques
- **Backup** quotidien

## 📞 SUPPORT ET ÉVOLUTION

### Support
- **Documentation** complète
- **Formation** utilisateurs
- **Support** technique 24/7
- **Communauté** active

### Évolution
- **Feedback** utilisateurs
- **Analytics** comportementaux
- **A/B testing** continu
- **Innovation** constante

---

**Dédépanne - Transformer le dépannage en service circulaire durable** 🌱

