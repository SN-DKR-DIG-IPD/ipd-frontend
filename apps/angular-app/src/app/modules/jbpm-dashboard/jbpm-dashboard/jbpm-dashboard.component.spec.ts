import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JbpmDashboardComponent } from './jbpm-dashboard.component';

describe('JbpmDashboardComponent', () => {
  let component: JbpmDashboardComponent;
  let fixture: ComponentFixture<JbpmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JbpmDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JbpmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
