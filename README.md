# DeDepanne - Plateforme de Dépannage à Domicile

## 📋 Description

DeDepanne est une plateforme web moderne qui connecte les clients ayant besoin de services de dépannage à domicile avec des techniciens qualifiés. Le projet est développé avec une architecture microservices utilisant Next.js pour le frontend et NestJS pour le backend.

## 🏗️ Architecture

```
dedepanne/
├── frontend-dedepanne/     # Application Next.js (React)
├── backend-dedepanne/      # API NestJS (Node.js)
└── docs/                   # Documentation du projet
```

## 🚀 Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI
- **React Hook Form** - Gestion des formulaires
- **Zustand** - Gestion d'état

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données
- **Prisma** - ORM
- **JWT** - Authentification
- **Docker** - Containerisation

## 📁 Structure du Projet

### Frontend (`frontend-dedepanne/`)
```
├── app/                    # Pages et routes (App Router)
├── components/             # Composants réutilisables
├── lib/                    # Utilitaires et configurations
├── hooks/                  # Hooks React personnalisés
├── styles/                 # Styles globaux
└── public/                 # Assets statiques
```

### Backend (`backend-dedepanne/`)
```
├── src/
│   ├── auth/              # Authentification et autorisation
│   ├── users/             # Gestion des utilisateurs
│   ├── services/          # Services métier
│   ├── technicians/       # Gestion des techniciens
│   ├── appointments/      # Gestion des rendez-vous
│   └── common/            # Utilitaires partagés
├── scripts/               # Scripts utilitaires
└── docker-compose.yml     # Configuration Docker
```

## 🛠️ Installation et Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Docker (optionnel)

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd dedepanne
```

2. **Installer les dépendances**
```bash
# Frontend
cd frontend-dedepanne
npm install

# Backend
cd ../backend-dedepanne
npm install
```

3. **Configuration de l'environnement**
```bash
# Backend
cp backend-dedepanne/env.example backend-dedepanne/.env
# Éditer .env avec vos configurations
```

4. **Démarrer les services**
```bash
# Backend (dans backend-dedepanne/)
npm run start:dev

# Frontend (dans frontend-dedepanne/)
npm run dev
```

## 🐳 Docker

Pour démarrer avec Docker :

```bash
cd backend-dedepanne
docker-compose up -d
```

## 📚 Documentation

- [PRD (Product Requirements Document)](frontend-dedepanne/PRD_DEDEPANNE.md)
- [Conception Frontend](frontend-dedepanne/CONCEPTION_FRONTEND.md)
- [Design System](frontend-dedepanne/DESIGN_SYSTEM.md)
- [Plan de Tests](frontend-dedepanne/PLAN_TESTS_DEPLOIEMENT.md)
- [UML](frontend-dedepanne/UML_DEDEPANNE.md)

## 🧪 Tests

```bash
# Frontend
cd frontend-dedepanne
npm run test

# Backend
cd backend-dedepanne
npm run test
```

## 📦 Déploiement

Le projet est configuré pour le déploiement avec Docker. Voir `PLAN_TESTS_DEPLOIEMENT.md` pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Frontend** - Interface utilisateur et expérience utilisateur
- **Développeur Backend** - API et logique métier
- **DevOps** - Infrastructure et déploiement

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub. 