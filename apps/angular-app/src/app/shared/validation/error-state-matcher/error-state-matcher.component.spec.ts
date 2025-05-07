import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcherCustom } from './error-state-matcher.component';

describe('ErrorStateMatcherCustom', () => {
  let errorStateMatcher: ErrorStateMatcherCustom;

  beforeEach(() => {
    errorStateMatcher = new ErrorStateMatcherCustom();
  });

  it('should create', () => {
    expect(errorStateMatcher).toBeTruthy();
  });

  it('should return false when control is null', () => {
    // Arrange
    const control = null;
    const form = {} as FormGroupDirective;

    // Act
    const result = errorStateMatcher.isErrorState(control, form);

    // Assert
    expect(result).toBeFalse();
  });


  it('should return true if control is invalid and dirty', () => {
    // Arrange
    const control = new FormControl('');
    control.markAsDirty();
    control.markAsTouched();
    control.setErrors({ required: true });
    const form: FormGroupDirective | NgForm | null = null;

    // Act
    const result = errorStateMatcher.isErrorState(control, form);

    // Assert
    expect(result).toBeTrue();
  });

  it('should return true if control is invalid and submitted', () => {
    // Arrange
    const control = new FormControl('');
    control.setErrors({ required: true });
    const form: FormGroupDirective | NgForm | null = {
      submitted: true
    } as any;

    // Act
    const result = errorStateMatcher.isErrorState(control, form);

    // Assert
    expect(result).toBeTrue();
  });

  it('should return false if control is valid and not dirty or touched', () => {
    // Arrange
    const control = new FormControl('valid-value');
    const form: FormGroupDirective | NgForm | null = null;

    // Act
    const result = errorStateMatcher.isErrorState(control, form);

    // Assert
    expect(result).toBeFalse();
  });
});
