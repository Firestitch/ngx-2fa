import {
  Component, Inject, ChangeDetectionStrategy, ViewChild,
} from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
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
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss'],
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
export class EmailsComponent {

  @ViewChild(VerificationMethodsComponent) 
  public verificationMethods: VerificationMethodsComponent;

  public twoFactorManageService: TwoFactorManageService;
  public VerificationMethodType = VerificationMethodType;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<EmailsComponent>,
    private _message: FsMessage,
  ) {
    this.twoFactorManageService = _data.twoFactorManageService;
  }

  public add(): void {
    this.twoFactorManageService.addEmail$()
      .subscribe(() =>{
        this.verificationMethods.reload();
      });
  }

  public deleted(): void {
    this._message.success('Deleted email verification method');
    if(!this.twoFactorManageService.hasVerificationMethod(VerificationMethodType.Email)) {
      this._dialogRef.close();
    }
  }

}
