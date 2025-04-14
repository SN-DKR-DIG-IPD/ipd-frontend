import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-reservation',
  templateUrl: './vehicle-reservation.component.html',
  styleUrl: './vehicle-reservation.component.scss'
})
export class VehicleReservationComponent {

  currentStep: number = 4;
  maxLevel = 4;
}
