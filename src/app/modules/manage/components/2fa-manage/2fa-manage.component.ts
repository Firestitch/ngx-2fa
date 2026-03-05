import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums';
import { IFsVerificationMethod } from '../../../../interfaces';
import { TwoFactorManageService } from '../../services';
import { ManageMethodsComponent } from '../manage-methods';
import { FsLabelModule } from '@firestitch/label';


@Component({
    selector: 'fs-2fa-manage',
    templateUrl: './2fa-manage.component.html',
    styleUrls: ['./2fa-manage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TwoFactorManageService],
    standalone: true,
    imports: [FsLabelModule],
})
export class Fs2faManageComponent implements OnDestroy, OnInit {
  private _cdRef = inject(ChangeDetectorRef);
  private _dialog = inject(MatDialog);
  private _twoFactorManageService = inject(TwoFactorManageService);


  @Input() public accountVerify: () => Observable<any>;
  @Input() public defaultCountry: string;
  @Input() public verificationMethodTypes: VerificationMethodType[];
  @Input() public verificationMethodsFetch: () => Observable<IFsVerificationMethod[]>;
  @Input() public verificationMethodDelete: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  @Input() public verificationMethodCreate: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  @Input() public verificationMethodDefault: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  @Input() public verificationMethodVerify: (code: string, trustDevice) => Observable<any>;
  @Input() public verificationMethodResend: () => Observable<any>;

  public statuses;

  private _destroy$ = new Subject();

  public ngOnInit(): void {
    this.verificationMethodTypes = this.verificationMethodTypes || [
      VerificationMethodType.Sms,
      VerificationMethodType.Email,
      VerificationMethodType.App,
    ];

    this._twoFactorManageService.registerVerificationMethodsFetch(this.verificationMethodsFetch);
    this._twoFactorManageService.registerVerificationMethodDelete(this.verificationMethodDelete);
    this._twoFactorManageService.registerVerificationMethodCreate(this.verificationMethodCreate);
    this._twoFactorManageService.registerVerificationMethodVerify(this.verificationMethodVerify);
    this._twoFactorManageService.registerVerificationMethodResend(this.verificationMethodResend);
    this._twoFactorManageService.registerVerificationMethodDefault(this.verificationMethodDefault);
    this._twoFactorManageService.registerAccountVerify(this.accountVerify);


    this._twoFactorManageService.verificationMethods$
      .subscribe((verificationMethods) => {
        const types = {
          sms: 'Text message',
          email: 'Email',
          app: 'Authenticator app',
        };

        this.statuses = Object.keys(
          verificationMethods.reduce((accum, verificationMethod) => {
            accum[verificationMethod.type] = true;

            return accum;
          }, {}),
        )
          .map((type) => {
            return types[type];
          });

        this._cdRef.markForCheck();
      });

    this._twoFactorManageService.verificationMethodsFetch();
  }

  public manage() {
    const dialogRef = this._dialog
      .open(ManageMethodsComponent, {
        autoFocus: false,
        data: {
          defaultCountry: this.defaultCountry,
          twoFactorManageService: this._twoFactorManageService,
          verificationMethodTypes: this.verificationMethodTypes,
        },
      });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public reload(): void {
    this._twoFactorManageService.verificationMethodsFetch();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }


}
