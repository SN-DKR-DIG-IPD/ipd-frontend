import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationErrorsComponent } from './validation-errors.component';
import { FormControl, Validators } from '@angular/forms';

describe('ValidationErrorsComponent', () => {
  let component: ValidationErrorsComponent;
  let fixture: ComponentFixture<ValidationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationErrorsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ValidationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnChanges', () => {
    spyOn(component, 'getErrors').and.callThrough();
    component.ngOnChanges();
    expect(component.getErrors).toHaveBeenCalled();
  });

  it('should return an empty array when control has no errors', function () {
    component.control = new FormControl();
    component.getErrors();
    expect(component.validationErrors).toEqual([]);
  });

  it('should handle control errors with multiple keys', function () {
    component.control = new FormControl('');
    component.control.setErrors({ required: true, minlength: true });
    component.customErrorMessages = [{ required: 'The name field is required' }];
    component.getErrors();
    expect(component.validationErrors).toEqual(['The name field is required', true]);
  });

});
