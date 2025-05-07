## Install

```sh
pnpm install
```

## Build TS modules and Web components

```sh
pnpm build
```

## Pour la gestion des environnements

Dans le fichier angular.json, assurez-vous que les environnements sont bien configurés pour les builds des differents environnements(de production et de développement etc)

```sh
pnpm --filter jbpm-frontend run build --configuration=production|prepod|developpement
```

## Pour Construire et exécuter l'image avec Docker en fonction de l'environnement:
 
 -  Exemple : pour la production :

```sh
docker build --build-arg BUILD_ENV=production -t jbpmportal .
docker run \
-e JBPM_KEYCLOAK_ISSUER='http://localhost:8082/' \
-e JBPM_KEYCLOAK_REALM='jbpm' \
-e JBPM_KEYCLOAK_CLIENT_ID='jbpm-client' \
-e JBPM_API_URL='http://localhost:8081' \
-e JBPM_KIE_SERVER_API_BASE_URL='http://localhost:8080/kie-server/services/rest/' \
-e JBPM_BUSINESS_CENTRAL_API_BASE_URL='http://localhost:8080/kie-server/services/rest/' \
-p 86:80 jbpmportal
```

 -  Exemple : pour développement :
 
```sh
docker build --build-arg BUILD_ENV=developpement -t jbpmportal .
docker run -p 86:80 jbpmportal
```
