import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { authInterceptor } from './app/core/auth/interceptors/auth.interceptor';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import {LOCALE_ID, provideAppInitializer, inject} from "@angular/core";
import { AuthService } from './app/core/auth/services/auth-service';

registerLocaleData(localeFr)

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {provide: LOCALE_ID, useValue: 'fr-FR'},
   // provideAppInitializer(() => inject(AuthService).getToken())
  ],
});
