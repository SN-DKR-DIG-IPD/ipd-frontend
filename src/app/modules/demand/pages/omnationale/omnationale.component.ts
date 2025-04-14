import {Component} from '@angular/core';

@Component({
  selector: 'app-omnationale',
  templateUrl: './omnationale.component.html',
  styleUrl: './omnationale.component.scss'
})
export class OMNationaleComponent {

  currentStep: number = 1;
  maxLevel = 1;
  constructor() {
  }
}
