#!/bin/bash
echo "cleaning..."
rm -rf apps/angular-app/.angular/;
rm -rf apps/angular-app/17.3.7/;
rm -rf apps/angular-app/dist/;
rm -rf apps/angular-app/node_modules/;
rm -rf node_modules/;
rm -rf packages/adapters/dist/;
rm -rf packages/adapters/node_modules/;
rm -rf packages/domain/dist/;
rm -rf packages/domain/node_modules/;
rm -rf packages/loader/dist/;
rm -rf packages/loader/node_modules/;
rm -rf packages/web-components/dist/;
rm -rf packages/web-components/node_modules/;
rm -rf package-lock.json; rm -rf pnpm-lock.yaml
