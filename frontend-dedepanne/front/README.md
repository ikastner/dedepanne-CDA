# Frontend Dédépanne

Application frontend sécurisée pour la plateforme Dédépanne, construite avec Next.js 15 et TypeScript.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Gestion des rôles** (admin, user, technician)
- **Interface moderne** avec Tailwind CSS
- **Validation des formulaires** avec Zod
- **Protection des routes** automatique
- **Design responsive** et accessible

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
│   ├── auth/              # Pages d'authentification
│   │   ├── login/         # Page de connexion
│   │   └── register/      # Page d'inscription
│   ├── dashboard/         # Dashboard protégé
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── auth/             # Composants d'authentification
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/               # Composants UI de base
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── contexts/             # Contextes React
│   └── AuthContext.tsx   # Contexte d'authentification
├── lib/                  # Utilitaires et configurations
│   ├── api.ts           # Client API
│   └── utils.ts         # Fonctions utilitaires
└── types/               # Types TypeScript
    └── auth.ts          # Types d'authentification
```

## 🔧 Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement :**
   Créer un fichier `.env.local` :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_ENV=development
   ```

3. **Démarrer le serveur de développement :**
   ```bash
   npm run dev
   ```

## 🔐 Authentification

### Fonctionnalités de sécurité

- **Tokens JWT** stockés dans des cookies sécurisés
- **Validation côté client** avec Zod
- **Protection des routes** automatique
- **Gestion des rôles** avec permissions
- **Intercepteurs Axios** pour les requêtes API

### Utilisation

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { login, logout, user, isAuthenticated } = useAuth();
```

## 🎨 Design System

### Composants UI

- **Button** : Boutons avec variantes (default, outline, destructive, etc.)
- **Input** : Champs de saisie avec validation
- **Card** : Conteneurs avec header, content, footer
- **ProtectedRoute** : Protection des routes par rôle

### Couleurs et thème

Utilisation de variables CSS pour un design system cohérent :
- Couleurs primaires et secondaires
- Mode sombre supporté
- Animations fluides

## 📱 Pages disponibles

- `/` : Redirection automatique vers login ou dashboard
- `/auth/login` : Page de connexion
- `/auth/register` : Page d'inscription
- `/dashboard` : Dashboard principal (protégé)

## 🔒 Sécurité

### Mesures implémentées

1. **Cookies sécurisés** :
   - `secure: true` en production
   - `sameSite: 'strict'`
   - Expiration automatique

2. **Validation des données** :
   - Validation côté client avec Zod
   - Validation côté serveur (backend)

3. **Protection des routes** :
   - Vérification automatique de l'authentification
   - Gestion des rôles et permissions

4. **Gestion des erreurs** :
   - Intercepteurs Axios pour les erreurs 401
   - Redirection automatique vers login

## 🚀 Déploiement

### Production

1. **Build de l'application :**
   ```bash
   npm run build
   ```

2. **Démarrer en production :**
   ```bash
   npm start
   ```

### Variables d'environnement de production

```env
NEXT_PUBLIC_API_URL=https://api.dedepanne.com
NEXT_PUBLIC_APP_ENV=production
```

## 🔧 Développement

### Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run lint` : Vérification du code

### Ajout de nouvelles fonctionnalités

1. **Nouveau composant** : Créer dans `src/components/`
2. **Nouvelle page** : Créer dans `src/app/`
3. **Nouveau type** : Ajouter dans `src/types/`
4. **Nouvelle API** : Étendre `src/lib/api.ts`

## 📚 Technologies utilisées

- **Next.js 15** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS
- **React Hook Form** : Gestion des formulaires
- **Zod** : Validation des schémas
- **Axios** : Client HTTP
- **js-cookie** : Gestion des cookies
- **Lucide React** : Icônes
- **Radix UI** : Composants accessibles

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails. 