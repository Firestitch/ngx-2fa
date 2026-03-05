import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { IFsVerificationMethod } from '../../../../interfaces/verification-method.interface';


@Component({
  templateUrl: './2fa-verification-methods.component.html',
  styleUrls: ['./2fa-verification-methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fs2faVerificationMethodsComponent {

  public verificationMethod: IFsVerificationMethod;
  public phone: string;
  public code: string;
  public verificationMethods: Record<string, IFsVerificationMethod[]>;
  public readonly verificationMethodType = VerificationMethodType;

  private _selectVerificationMethod: (IFsVerificationMethod) => Observable<IFsVerificationMethod>;  

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _dialogData: any,
    private _dialogRef: MatDialogRef<Fs2faVerificationMethodsComponent>,
  ) {
    this._selectVerificationMethod = _dialogData.selectVerificationMethod;
    this._setActiveMethod();
    this._initMethods(_dialogData.verificationMethods);
  }

  public compareWith(o1, o2) {
    return o1 && o2 && o1.id === o2.id;
  }

  public setVerificationMethod = () => {
    return this._selectVerificationMethod(this.verificationMethod)
      .pipe(
        tap((method: IFsVerificationMethod) => {
          this._dialogRef.close(method);
        }),
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
