# JbpmFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0.

## Development server
cd apps/angular-app
ng serve --proxy-config proxy.conf.json
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng test --code-coverage` to execute the unit tests with coverage.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Feature internationalisation
Pour comprendre ce qui a été fait suivre:
https://www.digitalocean.com/community/tutorials/angular-internationalization
https://www.youtube.com/watch?v=Krgh5IvZHh0

## Prerequise
## Installation of keycloack
Suivre la procédure ici:
https://www.keycloak.org/getting-started/getting-started-docker
S'assurer lors des étapes de créer un realm 'etalon' et un clientId 'etalon-client', pour plus de détail voir le fichier environment.ts
Après ajouter dans Realm roles, le rôle SUPER_ADMIN et dans users l'assigner dans Role mapping à l'utilisateur créé avec lequel on veut se connecter ( s'assurer dêtre dans le realm etalon)
Pour plus de précisions voir le dossier keycloack_config_capture à la racine de ce dossier
