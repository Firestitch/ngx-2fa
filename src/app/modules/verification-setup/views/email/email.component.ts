import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsApi } from '@firestitch/api';

import { from } from 'rxjs';

import { VerificationSetupService } from '../../services';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { FsLabelModule } from '@firestitch/label';
import { MatButton } from '@angular/material/button';


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
    this._api.get('account', {}, { key: 'account' })
      .subscribe(({ email }) => {
        this.email = email;
        this._cdRef.markForCheck();
      });
  }

  public next = () => {
    const redirect = this._route.snapshot.queryParams.redirect || '/';

    return from(this._router
      .navigate(['verify'], {
        relativeTo: this._route, 
        queryParams: { redirect }, 
      }));
  };

  public cancel() {
    this._verificationSetupService
      .signout()
      .subscribe();
  }

}
