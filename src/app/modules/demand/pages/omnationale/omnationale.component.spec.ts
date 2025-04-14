import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OMNationaleComponent } from './omnationale.component';

describe('OMNationaleComponent', () => {
  let component: OMNationaleComponent;
  let fixture: ComponentFixture<OMNationaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OMNationaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OMNationaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
