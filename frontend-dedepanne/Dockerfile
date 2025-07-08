# Dockerfile pour le frontend Next.js (développement)
FROM node:18-alpine

# Installer les outils de développement
RUN apk add --no-cache git

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./

# Installer les dépendances
RUN npm ci

# Copier le code source (sera monté en volume en développement)
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage en mode développement avec hot-reload
CMD ["npm", "run", "dev"] 