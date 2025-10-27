import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';


import { FsDialog } from '@firestitch/dialog';
import { FsMessage } from '@firestitch/message';

import { Observable, Subject } from 'rxjs';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { IFsVerificationMethod } from '../../../../interfaces/verification-method.interface';
import { Fs2faVerificationCodeComponent } from '../2fa-verification-code/2fa-verification-code.component';
import { Fs2faVerificationMethodsComponent } from '../2fa-verification-methods/2fa-verification-methods.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FsFormModule } from '@firestitch/form';
import { FsPhoneModule } from '@firestitch/phone';


@Component({
    selector: 'fs-2fa-verification',
    templateUrl: './2fa-verification.component.html',
    styleUrls: ['./2fa-verification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    standalone: true,
    imports: [
        Fs2faVerificationCodeComponent,
        MatCheckbox,
        FormsModule,
        FsFormModule,
        FsPhoneModule,
    ],
})
export class Fs2faVerificationComponent implements OnDestroy, AfterViewInit {

  @ViewChild(Fs2faVerificationCodeComponent)
  public verificationCodeComponent: Fs2faVerificationCodeComponent;

  @Input()
  public verificationMethod: IFsVerificationMethod;

  @Input()
  public resend: () => Observable<void>;

  @Input()
  public showTrustedDevice = true;

  @Input()
  public trustDevice = true;

  @Input()
  public codeLength;

  @Input()
  public trustDays;

  @Input()
  public code;

  @Input()
  public formatRecipient = false;

  @Input()
  public getVerificationMethods: () => Observable<IFsVerificationMethod[]>;

  @Input()
  public selectVerificationMethod: (verificationMethod: IFsVerificationMethod) => Observable<IFsVerificationMethod>;

  @Output()
  public verified = new EventEmitter<unknown>();

  @Output()
  public codeChange = new EventEmitter<unknown>();

  @Output()
  public codeCompleted = new EventEmitter<unknown>();

  @Output()
  public trustDeviceChange = new EventEmitter<boolean>();

  public VerificationMethodType = VerificationMethodType;

  private _destroy$ = new Subject<void>();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _dialog: FsDialog,
    private _message: FsMessage,
  ) {}

  public get recipient(): string {
    if(this.verificationMethod.type === VerificationMethodType.Email) {
      return this.verificationMethod.email;
    }

    if(this.verificationMethod.type === VerificationMethodType.Sms) {
      return this.verificationMethod.phoneNumber;
    }
  }

  public codeChanged(code): void {
    this.code = code;
    this.codeChange.emit(this.code);
  }

  public codeComplete(code): void {
    this.code = code;
    this.codeCompleted.emit(this.code);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public ngAfterViewInit(): void {
    this.verificationCodeComponent.focus();    
  }

  public resendCode(): Observable<any> {
    return this.resend()
      .pipe(
        tap(() => {
          this.code = '';
          this._message.success('Resent Code');
        }),
        finalize(() => {
          this.verificationCodeComponent.focus();  
        }),
      );
  }

  public showVerificationMethods(): void {
    this.getVerificationMethods()
      .pipe(
        switchMap((verificationMethods) => {
          return this._dialog.open(
            Fs2faVerificationMethodsComponent,
            {
              data: {
                verificationMethod: this.verificationMethod,
                verificationMethods,
                selectVerificationMethod: this.selectVerificationMethod,
              },
              minWidth: null,
            },
          )
            .afterClosed()
            .pipe(
              filter((verificationMethod) => !!verificationMethod),
            );
        }),
      )
      .subscribe((verificationMethod) => {
        this.verificationMethod = verificationMethod;
        this.code = '';
        this._cdRef.markForCheck();

        setTimeout(() => {
          this.verificationCodeComponent.focus();
        });
      });
  }

}
