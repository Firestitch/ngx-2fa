import { Injectable, inject } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class VerificationMethodData<T = any> {
  private _api = inject(FsApi);


  public verify(code: any, trustDevice: boolean, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'verifications/methods/verify',
      { code, trustDevice },
      {
        key: 'verificationMethod',
        ...config,
      },
    );
  }

  public resend(config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'verifications/methods/resend',
      {},
      {
        key: '',
        ...config,
      },
    );
  }

  public account(config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'verifications/methods/account',
      {},
      {
        key: 'verificationMethod',
        ...config,
      },
    );
  }


}
