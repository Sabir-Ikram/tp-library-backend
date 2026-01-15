# 1️⃣ Image Node.js
FROM node:20-alpine

# 2️⃣ Dossier de travail dans le conteneur
WORKDIR /app

# 3️⃣ Copier package.json + lock
COPY package*.json ./

# 4️⃣ Installer les dépendances
RUN npm install

# 5️⃣ Copier tout le code
COPY . .

# 6️⃣ Exposer le port (doit correspondre à server.js)
EXPOSE 3000

# 7️⃣ Lancer l’application
CMD ["node", "src/server.js"]
