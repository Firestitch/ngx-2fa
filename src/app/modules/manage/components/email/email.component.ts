import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Inject,
  ViewChild,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { FsFormDirective } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { TwoFactorManageService } from '../../services';


@Component({
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent {

  @ViewChild(FsFormDirective, { static: false })
  public form: FsFormDirective;

  public email;
  public code;
  public default;
  public verificationMethod = null;
  public trustDevice = true;
  public twoFactorManageService: TwoFactorManageService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<EmailComponent>,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) {
    this.twoFactorManageService = _data.twoFactorManageService;
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
                  this._message.success('Created email verification method');
                  this._dialogRef.close(verificationMethod);
                }),
              ) :
            this.twoFactorManageService.verificationMethodCreate$({
              type: VerificationMethodType.Email,
              email: this.email,
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
