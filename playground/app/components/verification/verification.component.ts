import { Component, ViewChild } from '@angular/core';

import { Fs2faVerificationComponent, IFsVerificationMethod, VerificationMethodType } from '@firestitch/2fa';
import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';

import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Fs2faVerificationComponent as Fs2faVerificationComponent_1 } from '../../../../src/app/modules/verification/components/2fa-verification/2fa-verification.component';
import { MatButton } from '@angular/material/button';
import { Fs2faVerificationResendDirective } from '../../../../src/app/modules/verification/directives/2fa-verification-resend.directive';


@Component({
    selector: 'app-verification',
    styleUrls: ['./verification.component.scss'],
    templateUrl: './verification.component.html',
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        Fs2faVerificationComponent_1,
        MatButton,
        Fs2faVerificationResendDirective,
    ],
})
export class VerificationComponent {

  @ViewChild(Fs2faVerificationComponent)
  public verificationComponent: Fs2faVerificationComponent;

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  public methods = [
    {
      id: 1,
      type: VerificationMethodType.Sms,
      phoneCode: 1,
      phoneCountry: 'CA',
      phoneNumber: '********32',
      default: false,
    },
    {
      id: 2,
      type: VerificationMethodType.Email,
      email: 'e******@example.com',
      default: false,
    },
    {
      id: 3,
      type: VerificationMethodType.Email,
      email: 'e******@example.com',
      default: false,
    },
    {
      id: 4,
      type: VerificationMethodType.Sms,
      phoneCode: 1,
      phoneCountry: 'CA',
      phoneNumber: '********47',
      default: true,
    },
    {
      id: 5,
      type: VerificationMethodType.App,
      default: false,
    },
  ];

  public verificationMethod: IFsVerificationMethod = {
    id: 4,
    type: VerificationMethodType.Sms,
    phoneCode: 1,
    phoneCountry: 'CA',
    phoneNumber: '(416) *** - **47',
    default: true,
  };

  constructor(
    private _message: FsMessage,
  ) {}

  public codeCompleted(): void {
    this.form.triggerSubmit();
  }

  public showVerificationMethods(): void {
    this.verificationComponent.showVerificationMethods();
  }

  public verify = (): Observable<any> => {
    console.log('Verify code', this.verificationComponent.code);

    return of({ code: this.verificationComponent.code, trustDevice: this.verificationComponent.trustDevice })
      .pipe(
        delay(1000),
        tap(() => {
          this._message.success('2FA successful');
        }),
      );
  };

  public resend = (): Observable<void> => {
    return of(null)
      .pipe(
        delay(2000),
      );
  };

  public getVerificationMethods = (): Observable<IFsVerificationMethod[]> => {
    return of(this.methods)
      .pipe(
        delay(100),
      );
  };

  public selectVerificationMethod = (verificationMethod: IFsVerificationMethod): Observable<IFsVerificationMethod> => {
    console.log('selectVerificationMethod', verificationMethod.id);
    const method = this.methods
      .find((item) => item.id === verificationMethod.id);

    return of(method)
      .pipe(
        delay(100),
      );
  };

}
