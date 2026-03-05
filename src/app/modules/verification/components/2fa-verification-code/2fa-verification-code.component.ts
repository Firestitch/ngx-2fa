import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { FsFormDirective } from '@firestitch/form';

import { VerificationMethodType } from '../../../../enums/verification-method-type.enum';
import { CodeInputComponent } from '../../../../modules/code-input/components/code-input';
import { NgTemplateOutlet } from '@angular/common';
import { CodeInputComponent as CodeInputComponent_1 } from '../../../code-input/components/code-input/code-input.component';


@Component({
    selector: 'fs-2fa-verification-code',
    templateUrl: './2fa-verification-code.component.html',
    styleUrls: ['./2fa-verification-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
    standalone: true,
    imports: [NgTemplateOutlet, CodeInputComponent_1],
})
export class Fs2faVerificationCodeComponent {
  private _form = inject(FsFormDirective);


  @ViewChild(CodeInputComponent)
  public codeInputComponent: CodeInputComponent;

  @Input()
  public type: VerificationMethodType;

  @Input()
  public recipient: string;

  @Input()
  public codeLength;

  @Input()
  public code;

  @Output()
  public codeChange = new EventEmitter<string>();

  @Output()
  public codeComplete = new EventEmitter<void>();

  public VerificationMethodType = VerificationMethodType;

  public codeCompleted(code): void {
    this.code = code;
    this.codeChange.emit(this.code);
    this.codeComplete.emit(code);
  }

  public codeChanged(code): void {
    this.code = code;
    this.codeChange.emit(this.code);
    this._form.dirty();
  }

  public focus(): void {
    this.codeInputComponent.focus();
  }

}
