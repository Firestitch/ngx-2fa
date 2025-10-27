import { Component, ChangeDetectionStrategy, ViewChild, inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { FsMessage } from '@firestitch/message';
import { VerificationMethodsComponent } from '../../../../modules/verification-methods/components/verification-methods';
import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { TwoFactorManageService } from '../../services';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { VerificationMethodsComponent as VerificationMethodsComponent_1 } from '../../../verification-methods/components/verification-methods/verification-methods.component';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';


@Component({
    templateUrl: './numbers.component.html',
    styleUrls: ['./numbers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        VerificationMethodsComponent_1,
        MatDialogActions,
        MatButton,
        FsFormModule,
        MatDialogClose,
    ],
})
export class NumbersComponent {
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<NumbersComponent>>(MatDialogRef);
  private _message = inject(FsMessage);


  @ViewChild(VerificationMethodsComponent) 
  public verificationMethods: VerificationMethodsComponent;

  public defaultCountry;
  public twoFactorManageService: TwoFactorManageService;
  public VerificationMethodType = VerificationMethodType;

  constructor() {
    const _data = this._data;

    this.twoFactorManageService = _data.twoFactorManageService;
    this.defaultCountry = _data.defaultCountry;
  }

  public add(): void {
    this.twoFactorManageService.addSms$(this.defaultCountry)
      .subscribe(() => {
        this.verificationMethods.reload();
      });
  }

  public deleted(): void {
    this._message.success('Deleted text message verification method');
    if(!this.twoFactorManageService.hasVerificationMethod(VerificationMethodType.Sms)) {
      this._dialogRef.close();
    }
  }

}
