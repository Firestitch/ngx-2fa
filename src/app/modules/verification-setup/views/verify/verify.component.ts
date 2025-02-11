import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { FsCookie } from '@firestitch/cookie';
import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IFsVerificationMethod } from '../../../../interfaces';
import { Fs2faVerificationComponent } from '../../../verification/components/2fa-verification';
import { VerificationMethodData } from '../../data';
import { VerificationSetupService } from '../../services';


@Component({
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyComponent implements OnInit {

  @ViewChild(Fs2faVerificationComponent)
  public verification: Fs2faVerificationComponent;

  public code = null;
  public verificationMethod: IFsVerificationMethod;

  private _cookie = inject(FsCookie);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _message = inject(FsMessage);
  private _verificationMethodData = inject(VerificationMethodData);
  private _cdRef = inject(ChangeDetectorRef);
  private _verificationSetupService = inject(VerificationSetupService);

  public ngOnInit(): void {
    this._verificationMethodData.account()
      .pipe(
        tap((verificationMethod) => {
          this.verificationMethod = verificationMethod;
          this._cdRef.markForCheck();
        }),
      )
      .subscribe();
  }

  public verify = (): Observable<any> => {
    return this._verificationMethodData
      .verify(this.code, this.verification.trustDevice)
      .pipe(
        tap(() => {
          const redirect = this._route.snapshot.queryParams.redirect || '/';
          this._message.success('Two factor verification successfully setup');
          this._router.navigateByUrl(redirect);
          this._cookie.delete('Token-Force-2fa');
        }),
      );
  };

  public resend = (): Observable<void> => {
    return this._verificationMethodData.resend();
  };

  public cancel() {
    this._verificationSetupService
      .signout()
      .subscribe();
  }

}
