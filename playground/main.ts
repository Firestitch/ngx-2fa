import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsFormModule } from '@firestitch/form';
import { FsPhoneModule } from '@firestitch/phone';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
    { path: '', component: ExamplesComponent },
    { path: 'verification', loadChildren: () => import("../src/app/modules/verification-setup").then((m) => m.FsVerificationSetupModule) },
];


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsLabelModule, FsStoreModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsFormModule.forRoot(), FsPhoneModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true })),
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

