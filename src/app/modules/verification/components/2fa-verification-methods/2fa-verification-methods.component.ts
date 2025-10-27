import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { IFsVerificationMethod } from '../../../../interfaces/verification-method.interface';
import { FsDialogModule } from '@firestitch/dialog';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';


@Component({
    templateUrl: './2fa-verification-methods.component.html',
    styleUrls: ['./2fa-verification-methods.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        FormsModule,
        FsFormModule,
        CdkScrollable,
        MatDialogContent,
        FsRadioGroupModule,
        MatIcon,
        MatRadioButton,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        KeyValuePipe,
    ],
})
export class Fs2faVerificationMethodsComponent {
  private _dialogData = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<Fs2faVerificationMethodsComponent>>(MatDialogRef);


  public verificationMethod: IFsVerificationMethod;
  public phone: string;
  public code: string;
  public verificationMethods: Record<string, IFsVerificationMethod[]>;
  public readonly verificationMethodType = VerificationMethodType;

  private _selectVerificationMethod: (IFsVerificationMethod) => Observable<IFsVerificationMethod>;  

  constructor() {
    const _dialogData = this._dialogData;

    this._selectVerificationMethod = _dialogData.selectVerificationMethod;
    this._setActiveMethod();
    this._initMethods(_dialogData.verificationMethods);
  }

  public compareWith(o1, o2) {
    return o1 && o2 && o1.id === o2.id
  }

  public setVerificationMethod = () => {
    return this._selectVerificationMethod(this.verificationMethod)
      .pipe(
        tap((method: IFsVerificationMethod) => {
          this._dialogRef.close(method);
        })
      );
  };

  private _setActiveMethod(): void {
    this.verificationMethod = this._dialogData?.verificationMethod;
  }

  private _initMethods(verificationMethods): void {
    this.verificationMethods = verificationMethods
      .reduce((acc, method) => {
        if (!acc[method.type]) {
          acc[method.type] = [];
        }

        acc[method.type].push(method);

        return acc;
      }, {});
  }
}
