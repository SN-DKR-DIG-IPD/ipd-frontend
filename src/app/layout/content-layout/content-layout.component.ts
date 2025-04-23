import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {TimelineComponent} from "../timeline/timeline.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {Router, RouterOutlet} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
import {DemandModule} from "../../modules/demand/demand.module";

@Component({
  selector: 'app-content-layout',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgClass,
    BreadcrumbComponent,
    TimelineComponent,
    SidebarComponent,
    NavbarComponent,
    RouterOutlet,
    NgIf,
    DemandModule,
    NgSwitchCase,
    NgSwitch,
  ],
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent implements OnInit{
  reduce = false;
  showmenu = false;
  currentRoute = false;
  userProfile!: KeycloakProfile
  userRole: string = ''
  isTimeline: boolean = false
  step: number = 0;

  constructor(private keycloakService: KeycloakService, private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url.includes('dashboard');

    this.keycloakService.loadUserProfile().then(result => this.userProfile = result)
  }

  onReduceChange(reduce: boolean) {
    this.reduce = reduce;
  }

  showMenu() {
    this.showmenu = !this.showmenu;
  }
  logout(){
    this.keycloakService.logout("")
  }

  handleTimelineChange(isTimeline: boolean) {
    this.isTimeline = isTimeline;
    this.cdr.detectChanges();
  }
  onStepChanged(step: number) {
    this.step = step;
  }
}
