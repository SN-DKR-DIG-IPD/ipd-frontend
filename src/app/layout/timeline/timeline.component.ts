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

  listingStep = [
    {"step" : 1, "stepName" : "PROJECT_CREATION"},
    {"step" : 2, "stepName" : "PRELIMINARY_ANALYSIS"},
    {"step" : 3, "stepName" : "OPPORTUNITY_ANALYSIS"},
    {"step" : 4, "stepName" : "DEEP_ANALYZE"},
    {"step" : 5, "stepName" : "IMPLEMENTATION"},
    {"step" : 6, "stepName" : "EXPLOITATION"},
    {"step" : 7, "stepName" : "EXIT"}
  ];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.setActiveStep();
  }

  setActiveStep(){
    const stepToActive = 2;
    if(stepToActive){
      this.activeStep = stepToActive ;
    }
  }
  goToStep(step: number) {
    this.currentStep = step;
  }
}
