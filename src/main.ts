import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // Asegúrate de que este sea el nombre real de tu clase en app.ts

// Arranque de la aplicación Angular
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
