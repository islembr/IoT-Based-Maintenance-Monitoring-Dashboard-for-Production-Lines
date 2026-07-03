import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MaintenanceDataService } from './services/maintenance-data.service';
function loadWorkbookData(data: MaintenanceDataService) { return () => data.loadAll(); }
export const appConfig: ApplicationConfig = { providers: [provideHttpClient(), { provide: APP_INITIALIZER, useFactory: loadWorkbookData, deps: [MaintenanceDataService], multi: true }] };
