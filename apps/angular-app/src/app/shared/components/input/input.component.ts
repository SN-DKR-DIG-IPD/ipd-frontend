import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { ErrorStateMatcherCustom } from '../../validation/error-state-matcher/error-state-matcher.component';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() hint: string | null = null;
  @Input() min: string | null = null;
  @Input() max: string | null = null;
  @Input() maxLength: string | null = null;
  @Input() pattern = '';
  @Input() customErrorMessages: Record<string, string>[] = [];
  matcher = new ErrorStateMatcherCustom();
}

