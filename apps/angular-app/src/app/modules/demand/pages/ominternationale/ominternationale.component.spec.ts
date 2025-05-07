import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OMInternationaleComponent } from './ominternationale.component';

describe('OMInternationaleComponent', () => {
  let component: OMInternationaleComponent;
  let fixture: ComponentFixture<OMInternationaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OMInternationaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OMInternationaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
