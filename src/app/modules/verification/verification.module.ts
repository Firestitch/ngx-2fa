import { NgModule } from '@angular/core';

import { Fs2faVerificationComponent } from './components/2fa-verification/2fa-verification.component';
import { Fs2faVerificationResendDirective } from './directives/2fa-verification-resend.directive';

@NgModule({
    imports: [
        Fs2faVerificationComponent,
        Fs2faVerificationResendDirective,
    ],
    exports: [
        Fs2faVerificationComponent,
        Fs2faVerificationResendDirective,
    ],
})
export class Fs2faVerificationModule { }
