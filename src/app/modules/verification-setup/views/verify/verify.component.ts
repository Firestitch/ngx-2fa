import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

import { FsCookie } from '@firestitch/cookie';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IFsVerificationMethod } from '../../../../interfaces';
import { Fs2faVerificationComponent } from '../../../verification/components/2fa-verification';
import { Fs2faVerificationComponent as Fs2faVerificationComponent_1 } from '../../../verification/components/2fa-verification/2fa-verification.component';
import { Fs2faVerificationResendDirective } from '../../../verification/directives/2fa-verification-resend.directive';
import { VerificationMethodData } from '../../data';
import { VerificationSetupService } from '../../services';


@Component({
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsSkeletonModule,
    FormsModule,
    FsFormModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    Fs2faVerificationComponent_1,
    MatButton,
    Fs2faVerificationResendDirective,
  ],
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
