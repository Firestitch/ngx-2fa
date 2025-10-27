import { Component, ViewChild } from '@angular/core';

import { Fs2faManageComponent, VerificationMethodType } from '@firestitch/2fa';

import { Observable, of } from 'rxjs';
import { VerificationMethodsComponent as VerificationMethodsComponent_1 } from '../../../../src/app/modules/verification-methods/components/verification-methods/verification-methods.component';


@Component({
    selector: 'app-verification-methods',
    styleUrls: ['./verification-methods.component.scss'],
    templateUrl: './verification-methods.component.html',
    standalone: true,
    imports: [VerificationMethodsComponent_1],
})
export class VerificationMethodsComponent {

  @ViewChild(Fs2faManageComponent)
  public manageComponent: Fs2faManageComponent;

  public VerificationMethodType = VerificationMethodType;

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
    return of(this._verificationMethods);
  };

  public verificationMethodDelete = (verificationMethod): Observable<any> => {
    this._verificationMethods = this._verificationMethods
    .filter((_verificationMethod) => {
      return _verificationMethod.id !== verificationMethod.id;
    });

    return of(true);
  };

  public accountVerify = (): Observable<any> => {
    console.log('Account verify');
    return of(true);
  };
}
