import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleReservationComponent } from './shuttle-reservation.component';

describe('ShuttleReservationComponent', () => {
  let component: ShuttleReservationComponent;
  let fixture: ComponentFixture<ShuttleReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShuttleReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShuttleReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
