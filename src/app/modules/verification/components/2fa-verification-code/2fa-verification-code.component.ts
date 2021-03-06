import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CodeInputComponent } from '../../../../modules/code-input/components/code-input';
import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';

import { IFsVerificationMethod } from '../../../../interfaces/verification-method.interface';


@Component({
  selector: 'fs-2fa-verification-code',
  templateUrl: './2fa-verification-code.component.html',
  styleUrls: [
    './2fa-verification-code.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    },
  ],
})
export class Fs2faVerificationCodeComponent {

  @ViewChild(CodeInputComponent)
  public codeInputComponent: CodeInputComponent;

  @Input()
  public type: VerificationMethodType;

  @Input()
  public recipient: string;

  @Input()
  public code;

  @Output()
  public codeChanged = new EventEmitter<string>();

  @Output()
  public codeCompleted = new EventEmitter<void>();

  public VerificationMethodType = VerificationMethodType;

  public codeChange(code): void {
    this.code = code;
    this.codeChanged.emit(this.code);
  }

  public focus(): void {
    this.codeInputComponent.focus();
  }

}
