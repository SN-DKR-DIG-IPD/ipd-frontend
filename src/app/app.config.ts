import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "./shared/shared.module";
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initKeycloak } from "./core/helper/keycloak/init.keycloak";
import { AppInterceptor } from "./core/service/interceptors/app.app.interceptor.interceptor";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },*/
    importProvidersFrom(
      LucideAngularModule,
      SharedModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ]
};
