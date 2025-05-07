# Étape 1 : Construction
FROM node:18.16-alpine AS builder

# Argument pour définir l'environnement de build (par défaut : production)
ARG BUILD_ENV=production

# Installer bash pour exécuter les scripts
RUN apk add --no-cache bash

# Définir le répertoire de travail
WORKDIR /app

# Copier le code source et les scripts
COPY . .
COPY clean.sh cleanreinstallandbuild.sh ./

# Donner les permissions d'exécution aux scripts
RUN chmod +x clean.sh cleanreinstallandbuild.sh

# Installer pnpm
RUN npm install -g pnpm@9.14.4

# Exécuter les scripts de nettoyage et de reconstruction

RUN bash ./cleanreinstallandbuild.sh

# Construire Angular en fonction de l'environnement
RUN pnpm --filter jbpm-frontend run build --configuration=${BUILD_ENV}

# Étape 2 : Image finale pour exécution
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Définir les variables d'environnement nécessaire au démarrage du conteneur, ces valeurs peuvent être redéfinies selon l'environnement de déploiement en prod
ENV JBPM_KEYCLOAK_ISSUER = "http://localhost:8082/"
ENV JBPM_KEYCLOAK_REALM = "jbpm"
ENV JBPM_KEYCLOAK_CLIENT_ID = "jbpm-client"
ENV JBPM_API_URL = "http://localhost:8081"
ENV JBPM_KIE_SERVER_API_BASE_URL = "http://localhost:8080/kie-server/services/rest/"
ENV JBPM_BUSINESS_CENTRAL_API_BASE_URL = "http://localhost:8080/kie-server/services/rest/"

# Copier un fichier de configuration Nginx personnalisé
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers Angular construits
COPY --from=builder /app/apps/angular-app/dist/jbpm/browser/ .

# Exposer le port
EXPOSE 80 8080 443

# Lancer Nginx
# CMD ["nginx", "-g", "daemon off;"]

# Quand le conteneur démarre, remplacer env.js par les valeurs venant des variables d'environnement
CMD ["/bin/sh",  "-c",  "scriptFilename=$(ls /usr/share/nginx/html/script*) && \
    newScriptValue=$(envsubst < $scriptFilename) && \
    echo $newScriptValue > $scriptFilename && exec nginx -g 'daemon off;'"]

# Vérifier que nginx a bien démarré
HEALTHCHECK CMD curl localhost:80/index.html || exit -1
