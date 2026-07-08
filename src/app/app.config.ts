import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MaintenanceDataService } from './services/maintenance-data.service';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { APP_ROUTES } from './app.routes';
function loadWorkbookData(data: MaintenanceDataService) { return () => data.loadAll(); }
export const appConfig: ApplicationConfig = { providers: [provideHttpClient(), provideRouter(APP_ROUTES, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), { provide: APP_INITIALIZER, useFactory: loadWorkbookData, deps: [MaintenanceDataService], multi: true }] };
