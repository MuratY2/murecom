import './app/firebase';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideBrowserGlobalErrorListeners,
         provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    /* everything that used to be in appConfig */
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    /* add HttpClient now or later */
    provideHttpClient()
  ]
}).catch(err => console.error(err));
