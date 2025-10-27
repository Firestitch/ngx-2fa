import {
  Component, ChangeDetectionStrategy, OnInit, Input, ViewChild, Output, EventEmitter,
} from '@angular/core';

import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';

import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { IFsVerificationMethod } from '../../../../interfaces';
import { VerificationMethodType } from '../../../../enums';
import { TwoFactorManageService } from '../../../manage/services';
import { MatIcon } from '@angular/material/icon';
import { FsCountryModule } from '@firestitch/country';
import { DefaultedComponent } from '../../../defaulted/components/defaulted/defaulted.component';
import { FsPhoneModule } from '@firestitch/phone';


@Component({
    selector: 'fs-2fa-verification-methods',
    templateUrl: './verification-methods.component.html',
    styleUrls: ['./verification-methods.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsListModule,
        MatIcon,
        FsCountryModule,
        DefaultedComponent,
        FsPhoneModule,
    ],
})
export class VerificationMethodsComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public type: VerificationMethodType;
  @Input() public accountVerify: () => Observable<any>;
  @Input() public verificationMethodsFetch: (query: any) => Observable<IFsVerificationMethod[]>;
  @Input() public verificationMethodDelete: (verificationMethod: IFsVerificationMethod) => Observable<any>;
  @Input() public verificationMethodDefault: (verificationMethod: IFsVerificationMethod) => Observable<any>;
  @Input() public twoFactorManageService: TwoFactorManageService;

  @Output() public deleted = new EventEmitter();
  
  public listConfig: FsListConfig;
  public VerificationMethodType = VerificationMethodType;

  constructor(
    private _prompt: FsPrompt,
  ) {}

  public ngOnInit(): void {
    if(!this.verificationMethodDefault && this.twoFactorManageService?.hasVerificationMethodDefault) {
      this.verificationMethodDefault = (verificationMethod: IFsVerificationMethod) => {
        return this.twoFactorManageService.verificationMethodDefault$(verificationMethod);
      }
    }
    
    if(!this.verificationMethodDelete && this.twoFactorManageService?.hasVerificationMethodDelete) {
      this.verificationMethodDelete = (verificationMethod: IFsVerificationMethod) => {
        return this.twoFactorManageService.verificationMethodDelete$(verificationMethod);
      }
    }
    
    if(!this.verificationMethodsFetch && this.twoFactorManageService?.hasVerificationMethodsFetch) {
      this.verificationMethodsFetch =  (query) => {
        return this.twoFactorManageService.verificationMethodsFetch$(query);
      }
    }
    
    if(!this.accountVerify && this.twoFactorManageService?.hasVerificationMethodVerify) {
      this.accountVerify = () => {
        return this.twoFactorManageService?.accountVerify$();
      }
    }

    this.listConfig = {
      paging: false,
      rowActions: [
        {
          click: (verificationMethod) => {
            this.accountVerify()
              .pipe(
                switchMap(() => this.verificationMethodDefault(verificationMethod)),
              )
              .subscribe(() => {
                this.list.reload();
              });
          },
          show: (data) => {
            return !!this.verificationMethodDefault && !data.default;
          },
          label: 'Set as Default',
        },
        {
          click: (verificationMethod) => {
            this._prompt.confirm({
              title: 'Confirm',
              template: 'Would you like to delete this verification method?',
            })
              .pipe(
                switchMap(() => this.accountVerify()),
                switchMap(() => this.verificationMethodDelete(verificationMethod)),
              )
              .subscribe(() => {
                this.deleted.emit();
                this.list.reload();
              });
          },
          show: () => {
            return !!this.verificationMethodDelete;
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          type: this.type,
        };

        return this.verificationMethodsFetch(query) 
          .pipe(
            map((verificationMethods) => ({
              data: verificationMethods.filter((verificationMethod) => {
                return !this.type || verificationMethod.type === this.type;
              }),
            }),
            ),
          );
      },
    };
  }

  public reload(): void {
    this.list.reload();
  }
}
