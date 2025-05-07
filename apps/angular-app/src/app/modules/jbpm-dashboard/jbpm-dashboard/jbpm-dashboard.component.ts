import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jbpm-dashboard',
  templateUrl: './jbpm-dashboard.component.html',
  styleUrl: './jbpm-dashboard.component.scss'
})
export class JbpmDashboardComponent {
group: string|undefined
constructor(
      public route: ActivatedRoute
){
  this.group = this.route.snapshot.params['group']
}  

}
