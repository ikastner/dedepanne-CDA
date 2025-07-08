# Dockerfile pour le backend NestJS (développement)
FROM node:18-alpine

# Installer les outils de développement
RUN apk add --no-cache git

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source (sera monté en volume en développement)
COPY src/ ./src/

# Exposer le port
EXPOSE 3001

# Commande de démarrage en mode développement avec hot-reload
CMD ["npm", "run", "start:dev"] 