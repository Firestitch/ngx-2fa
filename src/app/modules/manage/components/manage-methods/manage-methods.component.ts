import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { TwoFactorManageService } from '../../services';
import { EmailsComponent } from '../emails';
import { NumbersComponent } from '../numbers';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { DefaultedComponent } from '../../../defaulted/components/defaulted/defaulted.component';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { FsChipModule } from '@firestitch/chip';
import { FsPhoneModule } from '@firestitch/phone';


@Component({
    templateUrl: './manage-methods.component.html',
    styleUrls: ['./manage-methods.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatIcon,
        NgTemplateOutlet,
        DefaultedComponent,
        MatButton,
        FsFormModule,
        MatDialogActions,
        MatDialogClose,
        FsChipModule,
        FsPhoneModule,
    ],
})
export class ManageMethodsComponent implements OnInit, OnDestroy {

  public twoFactorManageService: TwoFactorManageService;
  public verificationMethods;
  public verificationMethodTypes = {};
  public VerificationMethodType = VerificationMethodType;

  private _destroy$ = new Subject();
  private _defaultCountry: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _cdRef: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _message: FsMessage,
  ) {}

  public ngOnInit(): void {
    this._defaultCountry = this._data.defaultCountry;
    this.twoFactorManageService = this._data.twoFactorManageService;
    this.verificationMethodTypes = this._data.verificationMethodTypes
      .reduce((verificationMethodTypes, verificationMethodType) => {
        verificationMethodTypes[verificationMethodType] = true;

        return verificationMethodTypes;
      }, {});

    this.twoFactorManageService.verificationMethods$
      .subscribe((verificationMethods) => {
        this.verificationMethods = verificationMethods;
        this._cdRef.markForCheck();
      });
  }

  public get defaultSms(): boolean {
    return this.twoFactorManageService.smsVerificationMethods
      .some((verificationMethod) => {
        return verificationMethod.default;
      });
  }

  public get defaultApp(): boolean {
    return this.twoFactorManageService.appVerificationMethods
      .some((verificationMethod) => {
        return verificationMethod.default;
      });
  }

  public get defaultEmail(): boolean {
    return this.twoFactorManageService.emailVerificationMethods
      .some((verificationMethod) => {
        return verificationMethod.default;
      });
  }

  public get textHasVerificationMethod(): boolean {
    return this.twoFactorManageService.hasVerificationMethod(VerificationMethodType.Sms);
  }

  public get appHasVerificationMethod(): boolean {
    return this.twoFactorManageService.hasVerificationMethod(VerificationMethodType.App);
  }

  public get emailHasVerificationMethod(): boolean {
    return this.twoFactorManageService.hasVerificationMethod(VerificationMethodType.Email);
  }

  public textMessageManage(): void {
    this._dialog.open(NumbersComponent, {
      data: {
        twoFactorManageService: this.twoFactorManageService,
        defaultCountry: this._defaultCountry,
      },
      minWidth: null,
    });
  }

  public textMessageAdd(): void {
    this.twoFactorManageService.addSms$(this._defaultCountry)
      .subscribe();
  }

  public emailMessageManage(): void {
    this._dialog.open(EmailsComponent, {
      data: {
        twoFactorManageService: this.twoFactorManageService,
      },
      minWidth: null,
    });
  }

  public emailMessageAdd(): void {
    this.twoFactorManageService.addEmail$()
      .subscribe();
  }

  public appRemove(): void {
    const verificationMethod = this.verificationMethods
      .find((_verificationMethod) => {
        return _verificationMethod.type === VerificationMethodType.App;
      });

    if(verificationMethod) {
      this.twoFactorManageService.accountVerify$()
        .pipe(
          switchMap(() => this.twoFactorManageService.verificationMethodDelete$(verificationMethod)),
        )
        .subscribe(() => {
          this._message.success('Removed App Authenticator verification method');
          this._cdRef.markForCheck();
        });
    }
  }

  public appAdd(): void {
    this.twoFactorManageService.addApp$()
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
