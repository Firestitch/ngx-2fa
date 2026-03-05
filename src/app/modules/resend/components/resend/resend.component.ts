import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, inject } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-resend',
    templateUrl: './resend.component.html',
    styleUrls: ['./resend.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatProgressSpinner],
})
export class ResendComponent implements OnDestroy {
  private _cdRef = inject(ChangeDetectorRef);


  @Input() public resend: () => Observable<any>;
  
  public resendInProgress = false;

  private _destroy$ = new Subject();

  public resendClick(): void {
    this.resendInProgress = true;
    this.resend()
      .pipe(
        finalize(() => {
          this.resendInProgress = false;  
          this._cdRef.markForCheck();  
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }


}
