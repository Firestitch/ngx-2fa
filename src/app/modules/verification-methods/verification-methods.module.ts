import { NgModule } from '@angular/core';

import { VerificationMethodsComponent } from './components/verification-methods/verification-methods.component';

@NgModule({
    imports: [
        VerificationMethodsComponent,
    ],
    exports: [
        VerificationMethodsComponent,
    ],
})
export class Fs2faVerificationMethodsModule { }
