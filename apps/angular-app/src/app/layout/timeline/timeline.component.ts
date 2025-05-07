import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from "lucide-angular";
import { NgClass, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgClass,
    TranslateModule,
    NgSwitch,
    NgSwitchCase,
    NgIf
  ]
})
export class TimelineComponent implements OnInit {
  activeStep: number = 1;

  @Output() isTimelineChange = new EventEmitter<boolean>();
  @Output() stepChanged = new EventEmitter<number>();
  @Input() routeParams = '';
  @Input() currentStep: number = 1;
  @Input() maxLevel: number = 1;
  @Input() totalSteps: number = 7;
  @Output() currentStepChange = new EventEmitter<number>();
  @Output() maxLevelChange = new EventEmitter<number>();

  listingStep = [
    { step: 1, stepName: "DEMAND" },
    { step: 2, stepName: "ACCOMPAGNANTS" },
    { step: 3, stepName: "PERDIEM" },
    { step: 4, stepName: "RES VEHICULE" },
    { step: 5, stepName: "RES BILLET" },
    { step: 6, stepName: "RES NAVETTE" },
    { step: 7, stepName: "RECAP" }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveStep();
    // Navigation déclenchée après le cycle initial
    setTimeout(() => this.goToStep(this.activeStep));
  }

  setActiveStep() {
    const stepToActivate = this.getStepByStepName("DEMAND");
    if (stepToActivate) {
      this.activeStep = stepToActivate.step;
    }
  }

  getStepByStepName(stepName: string) {
    return this.listingStep.find(step => step.stepName === stepName);
  }

  goToStep(step: number) {
    this.currentStep = step;

    // Mettre à jour maxLevel si on avance dans le parcours
    if (step > this.maxLevel) {
      this.maxLevel = step;
    }

    const urlMap: { [key: number]: string } = {
      1: this.router.url.includes('omnationale') ? '/demand/omnationale' :
        this.router.url.includes('ominternationale') ? '/demand/ominternationale' : '',
      2: '/home/demand/companions',
      3: '/home/demand/perdiem',
      4: '/home/demand/vehicle-reservation',
      5: '/home/demand/ticket-reservation',
      6: '/home/demand/shuttle-reservation',
      7: '/home/demand/summary'
    };

    const destination = urlMap[step];
    if (destination) {
      this.router.navigate([destination]);
    }

    this.currentStepChange.emit(this.currentStep);
    this.maxLevelChange.emit(this.maxLevel);
  }

}
