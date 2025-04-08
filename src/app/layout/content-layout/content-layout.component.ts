import {Component, OnInit} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {NgClass, NgIf} from "@angular/common";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {TimelineComponent} from "../timeline/timeline.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

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
  ],
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent implements OnInit{
  reduce = false;
  showmenu = false;
  userProfile!: KeycloakProfile
  userRole: string = ''
  isTimeline: boolean = false

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then(result => this.userProfile = result)
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;

    const realmRoles = tokenParsed?.realm_access?.roles || [];

    this.userRole = realmRoles.filter(role =>
      role !== 'offline_access' &&
      role !== 'uma_authorization' &&
      !role.startsWith('default-roles-')
    )[0]
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
    console.log(isTimeline)
  }
}
