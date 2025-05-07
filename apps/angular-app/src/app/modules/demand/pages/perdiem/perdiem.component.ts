import { Component } from '@angular/core';

@Component({
  selector: 'app-perdiem',
  templateUrl: './perdiem.component.html',
  styleUrl: './perdiem.component.scss'
})
export class PerdiemComponent {

  currentStep: number = 3;
  maxLevel = 3;
}
