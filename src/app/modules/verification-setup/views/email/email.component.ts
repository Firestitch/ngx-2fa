import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

import { FsApi } from '@firestitch/api';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';

import { VerificationSetupService } from '../../services';


@Component({
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
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
    FsLabelModule,
    MatButton,
  ],
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
    const redirect = this._route.snapshot.queryParams.redirect || '/';
    this._router.navigate(['verify'], {
      relativeTo: this._route, 
      queryParams: { redirect }, 
    });

    return of(true);
  };

  public cancel() {
    this._verificationSetupService
      .signout()
      .subscribe();
  }

}
