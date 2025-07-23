# Documentation – Dashboard OM Angular & jBPM

## 1. Récupération dynamique des containers jBPM

- **Service utilisé** : `ContainerService` (Angular)
- **Appel API** :
  - L'application interroge l'API jBPM via le proxy Angular (`proxy.conf.json`) pour obtenir la liste des containers déployés.
  - Endpoint utilisé : `/jbpm/api/containers` (proxy vers `/kie-server/services/rest/server/containers`)
- **Traitement** :
  - Le résultat est parsé pour extraire la liste des containers (`container-id`, `container-alias`).
  - Cette liste alimente le select "Type OM" dans le dashboard.

## 2. Récupération des instances de processus d'un container

- **Service utilisé** : `ProcessInstanceService` (Angular)
- **Appel API** :
  - Lorsqu'un container est sélectionné, le front appelle :
    `/jbpm/api/containers/{containerId}/processes/instances`
    (proxy vers `/kie-server/services/rest/server/containers/{containerId}/processes/instances`)
  - Le header d'authentification Basic est injecté depuis le `sessionStorage`.
- **Traitement** :
  - Le résultat est parsé pour obtenir la liste des instances de processus (tableau d'objets).
  - Cette liste est stockée dans `processList`.

## 3. Filtrage dynamique du tableau

- **Comportement** :
  - Quand l'utilisateur sélectionne un type OM (container) dans le select, la méthode `applyFilter()` filtre `processList` pour n'afficher que les instances du container sélectionné.
  - Si aucun type n'est sélectionné, toutes les instances sont affichées.
  - Le filtrage est insensible à la casse et aux espaces.

## 4. Affichage dans le dashboard

- **Template HTML** :
  - Le tableau affiche les colonnes principales (Référence, Type OM, Date début, Statut, etc.) en mappant les champs du backend.
  - Les valeurs sont formatées (dates, statuts, etc.) via des méthodes utilitaires.
  - Un encart DEBUG temporaire permet de visualiser la valeur de `selectedContainerId` et le contenu de `processList` pour faciliter le debug.

## 5. Gestion des erreurs

- Si l'API retourne une erreur (404, container non trouvé), le tableau reste vide et une erreur est loggée en console.
- Il est important d'utiliser un `container-id` existant côté jBPM pour que l'API retourne des données.

## 6. Proxy Angular

- Le fichier `proxy.conf.json` redirige `/jbpm/api` vers le backend jBPM pour éviter les problèmes de CORS et simplifier les URLs côté front.

## 7. À faire pour la production

- Retirer l'encart DEBUG du template.
- Adapter le mapping des colonnes si la structure des instances change.
- Ajouter la gestion des cas d'erreur utilisateur (ex : message si aucun container ou aucune instance).

---

**Résumé** :
Le dashboard Angular récupère dynamiquement la liste des containers jBPM, puis les instances de processus du container sélectionné, et affiche le tout dans un tableau filtrable en temps réel. Toute la logique repose sur l'utilisation des services Angular, du proxy, et d'un filtrage JS robuste. 