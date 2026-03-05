import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsApi } from '@firestitch/api';

import { of, tap } from 'rxjs';

import { VerificationSetupService } from '../../services';


@Component({
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent implements OnInit {

  public email = null;

  private _api = inject(FsApi);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _cdRef = inject(ChangeDetectorRef);
  private _verificationSetupService = inject(VerificationSetupService);

  public ngOnInit(): void {
    this._api
      .get('account', {}, { key: 'account' })
      .subscribe(({ email }) => {
        this.email = email;
        this._cdRef.markForCheck();
      });
  }

  public next = () => {
    return of(true)
      .pipe(
        tap(() => {
          const redirect = this._route.snapshot.queryParams.redirect || '/';
          this._router.navigate(['verify'], {
            relativeTo: this._route, 
            queryParams: { redirect }, 
          });
        }),
      );
  };

  public cancel() {
    this._verificationSetupService
      .signout()
      .subscribe();
  }

}
