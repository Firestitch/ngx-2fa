import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { TwoFactorManageService } from '../../services';
import { FormsModule } from '@angular/forms';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Fs2faVerificationComponent } from '../../../verification/components/2fa-verification/2fa-verification.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsPhoneModule } from '@firestitch/phone';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        Fs2faVerificationComponent,
        MatFormField,
        MatLabel,
        MatInput,
        FsPhoneModule,
        MatCheckbox,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
})
export class NumberComponent {
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<NumberComponent>>(MatDialogRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _message = inject(FsMessage);


  @ViewChild(FsFormDirective, { static: false })
  public form: FsFormDirective;

  public phone;
  public code;
  public default;
  public trustDevice = true;
  public verificationMethod = null;
  public defaultCountry;
  public twoFactorManageService: TwoFactorManageService;

  constructor() {
    const _data = this._data;

    this.twoFactorManageService = _data.twoFactorManageService;
    this.defaultCountry = _data.defaultCountry;
    this.default = !this.twoFactorManageService.hasVerificationMethods;
  }

  public resend = (): Observable<void> => {
    return this.twoFactorManageService.verificationMethodResend()
      .pipe(
        tap(() => {
          this._message.success('Resent verification code');
        }),
      );
  };

  public submit = () => {
    return of(true)
      .pipe(
        switchMap(() => {
          return this.verificationMethod ?
            this.twoFactorManageService.verificationMethodVerify$(this.code, this.trustDevice)
              .pipe(
                tap((verificationMethod) => {
                  this._message.success('Created text message verification method');
                  this._dialogRef.close(verificationMethod);
                }),
              ) :
            this.twoFactorManageService.verificationMethodCreate$({
              type: VerificationMethodType.Sms,
              phoneNumber: this.phone.number,
              phoneCode: this.phone.countryCode,
              phoneCountry: this.phone.isoCode,
              default: this.default,
            })
              .pipe(
                tap((verificationMethod) => {
                  this.verificationMethod = verificationMethod;
                  this.form.clear();
                  this._cdRef.markForCheck();
                }),
              );
        }),
      );
  };

  public codeCompleted(code): void {
    this.code = code;
    //Legacy support
    setTimeout(() => {
      if(!this.form.submitting) {
        this.form.triggerSubmit();
      }
    });
  }

}
