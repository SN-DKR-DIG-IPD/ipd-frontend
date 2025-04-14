import {Component} from '@angular/core';

@Component({
  selector: 'app-companions',
  templateUrl: './companions.component.html',
  styleUrl: './companions.component.scss'
})
export class CompanionsComponent {

  currentStep: number = 2;
  maxLevel = 2;
}
