import { Injectable, OnDestroy, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../enums/verification-method-type.enum';
import { IFsVerificationMethod } from '../../../interfaces';
import { AppComponent } from '../components/app';
import { EmailComponent } from '../components/email';
import { NumberComponent } from '../components/number';


@Injectable()
export class TwoFactorManageService implements OnDestroy {
  private _dialog = inject(MatDialog);


  private _destroy$ = new Subject();

  private _verificationMethodsFetch: (query: any) => Observable<any[]>;
  private _verificationMethodCreate: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  private _verificationMethodDelete: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  private _verificationMethodDefault: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;
  private _verificationMethodVerify: (code, trustDevice: boolean) => Observable<any>;
  private _verificationMethodResend: () => Observable<any>;
  private _accountVerify: () => Observable<any[]>;
  private _verificationMethods$ = new BehaviorSubject<any[]>([]);

  public get verificationMethods$() {
    return this._verificationMethods$
      .pipe(
        takeUntil(this._destroy$),
      );
  }
  
  public get verificationMethods() {
    return this._verificationMethods$.getValue();
  }

  public get hasVerificationMethods(): boolean {
    return !!this._verificationMethods$.getValue().length;
  }

  public get emailVerificationMethods() {
    return this.getVerificationMethods(VerificationMethodType.Email);
  }

  public get smsVerificationMethods() {
    return this.getVerificationMethods(VerificationMethodType.Sms);
  }

  public get appVerificationMethods() {
    return this.getVerificationMethods(VerificationMethodType.App);
  }
  
  public getVerificationMethods(type) {
    return this.verificationMethods
      .filter((verificationMethod) => {
        return verificationMethod.type === type;
      });
  }
  
  public hasVerificationMethod(type) {
    return this.verificationMethods
      .some((verificationMethod) => {
        return verificationMethod.type === type;
      });
  }

  public registerVerificationMethodDefault(value) {
    this._verificationMethodDefault = value;
  }

  public registerVerificationMethodResend(value) {
    this._verificationMethodResend = value;
  }

  public registerVerificationMethodsFetch(value) {
    this._verificationMethodsFetch = value;
  }

  public registerVerificationMethodDelete(value) {
    this._verificationMethodDelete = value;
  }

  public registerVerificationMethodCreate(value) {
    this._verificationMethodCreate = value;
  }

  public registerVerificationMethodVerify(value) {
    this._verificationMethodVerify = value;
  }

  public registerAccountVerify(value) {
    this._accountVerify = value;
  }

  public get hasVerificationMethodResend() {
    return !!this._verificationMethodResend;
  }

  public get hasVerificationMethodDefault() {
    return !!this._verificationMethodDefault;
  }

  public get hasVerificationMethodsFetch() {
    return !!this._verificationMethodsFetch;
  }

  public get hasVerificationMethodDelete() {
    return !!this._verificationMethodDelete;
  }

  public get hasVerificationMethodCreate() {
    return !!this._verificationMethodCreate;
  }

  public get hasVerificationMethodVerify() {
    return !!this._verificationMethodVerify;
  }

  public verificationMethodDelete$(verificationMethod): Observable<any> {
    return this._verificationMethodDelete(verificationMethod)
      .pipe(
        tap(() => {
          this.verificationMethodsFetch();
        }),
      );
  }

  public verificationMethodVerify$(code, trustDevice): Observable<any> {
    return this._verificationMethodVerify(code, trustDevice)
      .pipe(
        tap(() => {
          this.verificationMethodsFetch();
        }),
      );
  }

  public verificationMethodCreate$(verificationMethod): Observable<any>  {
    return this._verificationMethodCreate(verificationMethod);
  }

  public verificationMethodDefault$(verificationMethod): Observable<any>  {
    return this._verificationMethodDefault(verificationMethod);
  }

  public verificationMethodResend(): Observable<any>  {
    return this._verificationMethodResend();
  }

  public verificationMethodsFetch(query?: any) {
    this.verificationMethodsFetch$(query)
      .subscribe();
  }

  public verificationMethodsFetch$(query?: any): Observable<any> {
    return this._verificationMethodsFetch(query)
      .pipe(
        tap((verificationMethods) => {
          this._verificationMethods$.next(verificationMethods);
        }),
      );
  }

  public accountVerify$(): Observable<any> {
    return this._accountVerify ? this._accountVerify() : of(true);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public addSms$(defaultCountry): Observable<any>{
    return this.accountVerify$()
      .pipe(
        switchMap(() => this._dialog.open(NumberComponent, {
          data: {
            defaultCountry,
            twoFactorManageService: this,
          },
          minWidth: null,
        })
          .afterClosed(),
        ),
        tap(() => {
          this.verificationMethodsFetch();
        }),
        takeUntil(this._destroy$),
      );
  }

  public addEmail$(): Observable<any>{
    return this.accountVerify$()
      .pipe(
        switchMap(() => this._dialog.open(EmailComponent, {
          data: { twoFactorManageService: this },
          minWidth: null,
        })
          .afterClosed(),
        ),
        tap(() => {
          this.verificationMethodsFetch();
        }),
        takeUntil(this._destroy$),
      );
  }

  public addApp$(): Observable<any>{
    return this.accountVerify$()
      .pipe(
        switchMap(() => this._dialog.open(AppComponent, {
          data: { twoFactorManageService: this  },
          minWidth: null,
        })
          .afterClosed(),
        ),
        tap(() => {
          this.verificationMethodsFetch();
        }),
        takeUntil(this._destroy$),
      );
  }
}
