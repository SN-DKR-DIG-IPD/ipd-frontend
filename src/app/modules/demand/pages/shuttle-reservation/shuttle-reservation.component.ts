import { Component } from '@angular/core';

@Component({
  selector: 'app-shuttle-reservation',
  templateUrl: './shuttle-reservation.component.html',
  styleUrl: './shuttle-reservation.component.scss'
})
export class ShuttleReservationComponent {
  currentStep: number = 6;
  maxLevel = 6;
}
