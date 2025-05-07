import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
})
export class ValidationErrorsComponent implements OnChanges {
  @Input() control!: FormControl;
  @Input() customErrorMessages: Record<string, string>[] = [];
  validationErrors: any[] = [];

  ngOnChanges(): void {
    this.getErrors();
  }

  getErrors(): void {
    if (this.control?.errors) {
      this.validationErrors = [];
      const currentErrors = Object.entries(this.control.errors).map(([keyError, errorValue]) => ({ [keyError]: errorValue }));
      for (const key in currentErrors) {
        if (currentErrors.hasOwnProperty(key)) {
          const element = currentErrors[key];
          const keys = Object.keys(element);
          const item = this.customErrorMessages.find(item => item.hasOwnProperty(keys[0])) ?? element;
          this.validationErrors.push(Object.values(item).shift());
        }
      }
    }
  }

}
