import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {LucideAngularModule} from "lucide-angular";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgClass,
    TranslateModule
  ]
})
export class TimelineComponent implements OnInit{
  @Input() currentStep: number = 1;
  @Input() maxLevel: number = 1;
  @Input() totalSteps: number = 7;
  @Output() currentStepChange = new EventEmitter<number>();
  @Output() maxLevelChange = new EventEmitter<number>();
  @Input() shouldRoute = false;
  @Input() routeParams = ''
  expectedPermissions = 'MENU_PARTNERSHIP_MANAGER';
  timelineHidden = false;
  disableStep = false;
  activeStep : number =  1;
  @Output() isTimelineChange = new EventEmitter<boolean>();

  listingStep = [
    {"step" : 1, "stepName" : "DEMAND"},
    {"step" : 2, "stepName" : "ACCOMPAGNANTS"},
    {"step" : 3, "stepName" : "PERDIEM"},
    {"step" : 4, "stepName" : "RES VEHICULE"},
    {"step" : 5, "stepName" : "RES BILLET"},
    {"step" : 6, "stepName" : "RES NAVETTE"},
    {"step" : 7, "stepName" : "RECAP"}
  ];

  constructor(private router: Router) {
    this.checkRoute();
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    this.timelineHidden = currentUrl.includes('/dashboard');
    console.log(this.timelineHidden)
    this.isTimelineChange.emit(this.timelineHidden);
  }
  ngOnInit(): void {
    this.setActiveStep();
  }

  setActiveStep(){
    const stepToActive = this.getStepByStepName("DEMAND");
    if(stepToActive){
      this.activeStep = stepToActive.step ;
    }
  }

  getStepByStepName(stepName : string) {
    return this.listingStep.find(step => step.stepName === stepName);
  }


  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps && (step < this.maxLevel)) {
      this.currentStep = step;
    }
    this.currentStepChange.emit(this.currentStep);
    this.maxLevelChange.emit(this.maxLevel);
    console.log(this.routeParams);
    if (this.shouldRoute) {
      switch (step) {
        case 1:
          this.router.navigate(['/demand/' + this.routeParams])
          break;
        case 2:
          this.router.navigate(['/project/preliminary-analysis/' + this.routeParams]);
          break;
        case 3:
          this.router.navigate(['/project/opportunity-analysis/' + this.routeParams])
          break;
        case 4:
          this.router.navigate(['/project/deep-analysis/' + this.routeParams])
          break;
        case 5:
          this.router.navigate(['/project/implementation/' + this.routeParams])
          break;
        default:
          break;
      }
    }
  }
}
