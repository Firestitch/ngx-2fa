import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { TwoFactorManageService } from '../../services';
import { FormsModule } from '@angular/forms';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsQrcodeModule } from '@firestitch/qrcode';
import { CodeInputComponent } from '../../../code-input/components/code-input/code-input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        FsSkeletonModule,
        FsQrcodeModule,
        CodeInputComponent,
        MatCheckbox,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
})
export class AppComponent implements OnInit {
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<AppComponent>>(MatDialogRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _message = inject(FsMessage);


  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  public twoFactorManageService: TwoFactorManageService;
  public mode: 'qr-code' | 'code-input' = 'qr-code';
  public accountId;
  public verificationMethod;
  public qrCodeUrl;
  public code;
  public default;  
  public appType: 'google' | 'authy';

  public ngOnInit(): void {
    this.twoFactorManageService = this._data.twoFactorManageService;
    this.accountId = this._data.accountId;
    this.default = !this.twoFactorManageService.hasVerificationMethods;
  }

  public appTypeGoogle(): void {
    this.appTypeSelect('google');
  }

  public appTypeAuthy(): void {
    this.appTypeSelect('authy');
  }

  public appTypeSelect(appType): void {
    this.appType = appType;
    this.twoFactorManageService.verificationMethodCreate$({
      type: VerificationMethodType.App,
    })
      .subscribe((verificationMethod) => {
        this.verificationMethod = verificationMethod;
        this.qrCodeUrl = verificationMethod.qrCodeUrl;
        this._cdRef.markForCheck();
      });
  }

  public codeCompleted(): void {
    this.form.triggerSubmit();
  }

  public codeChanged(code): void {
    this.code = code;
    this.form.dirty();
  }

  public next(): void {
    this.mode = 'code-input';
  }

  public verify = () => {
    return this.twoFactorManageService.verificationMethodVerify$(this.code, true)
      .pipe(
        switchMap(() => {
          return this.default && this.twoFactorManageService.verificationMethodDefault$ ?
            this.twoFactorManageService.verificationMethodDefault$(this.verificationMethod) :
            of(true);
        }),
        tap(() => {
          this._message.success('Created app authenticator verification method');
          this._dialogRef.close(true);
        }),
      );
  };

}
