/// <reference types="@angular/localize" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { defineCustomElements as defineJbpmCustomElements, applyPolyfills } from '@jbpm/web-components/loader';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Bind the custom elements to the window object
// applyPolyfills().then(() => {
//   defineJbpmCustomElements(window);
// });
