import { Component, ViewChild } from '@angular/core';

import {
  Fs2faManageComponent, IFsVerificationMethod, VerificationMethodType,
} from '@firestitch/2fa';
import { guid } from '@firestitch/common';

import { Observable, of } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { Fs2faManageComponent as Fs2faManageComponent_1 } from '../../../../src/app/modules/manage/components/2fa-manage/2fa-manage.component';

@Component({
    selector: 'app-manage-verifications',
    styleUrls: ['./manage-verifications.component.scss'],
    templateUrl: './manage-verifications.component.html',
    standalone: true,
    imports: [
        MatButton,
        FsFormModule,
        Fs2faManageComponent_1,
    ],
})
export class ManageVerificationsComponent {

  @ViewChild(Fs2faManageComponent)
  public manageComponent: Fs2faManageComponent;

  public VerificationMethodType = VerificationMethodType;

  private _createVerificationMethod;
  private _verificationMethods = [
    {
      id: 5,
      accountId: 2023,
      state: 'active',
      type: VerificationMethodType.Email,
      default: false,
      email: 'bob@email.com',
    },
    {
      id: 6,
      accountId: 2023,
      state: 'active',
      type: VerificationMethodType.Sms,
      phoneCode: 1,
      phoneCountry: 'CA',
      phoneNumber: 4165554444,
      default: true,
    },
    {
      id: 7,
      accountId: 2023,
      state: 'active',
      type: VerificationMethodType.App,
    },
  ];

  public verificationMethodsFetch = (): Observable<any[]> => {
    console.log('verificationMethodsFetch');

    return of(this._verificationMethods);
  };

  public verificationMethodDelete = (verificationMethod): Observable<any> => {
    console.log('verificationMethodDelete', verificationMethod);
    this._verificationMethods = this._verificationMethods
      .filter((_verificationMethod) => {
        return _verificationMethod.id !== verificationMethod.id;
      });

    return of(true);
  };

  public verificationMethodCreate = (verificationMethod): Observable<any> => {
    console.log('verificationMethodCreate', verificationMethod);
    this._createVerificationMethod = {
      ...verificationMethod,
      id: guid(),
      qrCodeUrl: 'https://google.com',
    };

    return of(this._createVerificationMethod);
  };

  public verificationMethodVerify = (code, trustDevice): Observable<any> => {
    console.log('verificationMethodVerify', code, trustDevice);
    this._verificationMethods.push(this._createVerificationMethod);

    if(this._createVerificationMethod.default) {
      this._verificationMethods
        .filter((verificationMethod) => (verificationMethod.id !== this._createVerificationMethod.id))
        .forEach((verificationMethod) => {
          verificationMethod.default = false;
        });
    }

    return of(true);
  };

  public verificationMethodResend = (): Observable<any> => {
    console.log('verificationMethodResend');

    return of(true);
  };

  public verificationMethodDefault = (verificationMethod: IFsVerificationMethod): Observable<IFsVerificationMethod> => {
    console.log('verificationMethodDefault');

    this._verificationMethods
      .forEach((item) => {
        item.default = false;
      });
    
    verificationMethod.default = true;

    return of(verificationMethod);
  };

  public accountVerify = (): Observable<any> => {
    console.log('accountVerify');

    return of(true);
  };
}
