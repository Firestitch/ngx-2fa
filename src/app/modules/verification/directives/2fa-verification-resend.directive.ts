import { Directive, HostListener, inject, Input } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { finalize } from 'rxjs/operators';

import { Fs2faVerificationComponent } from '../components/2fa-verification/2fa-verification.component';

@Directive({
    selector: '[fs2faVerificationResend]',
    standalone: true,
})
export class Fs2faVerificationResendDirective {  
  
  @Input('fs2faVerificationResend') public verification: Fs2faVerificationComponent;

  private _button = inject(MatButton);
  
  @HostListener('click')
  public click() {
    this._button.disabled = true;
    this.verification.resendCode()
      .pipe(
        finalize(() => this._button.disabled = false),
      )
      .subscribe();
  }

}
