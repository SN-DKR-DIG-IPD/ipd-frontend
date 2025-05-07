import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from '../../core/service/user/user.service';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() isSidebarOpen = false;
  @Output() isSidebarOpenEvent = new EventEmitter<boolean>();

  isOpen = false;
  userProfile: KeycloakProfile | null = null;

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService,
    private elementRef: ElementRef, private router: Router, private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe((url: string) => {
        this.isDashboardPage = url === '/dashboard';
        if (!this.isDashboardPage) {
          this.isMenuVisible = false;
        }

        const isTimelinePage = this.timelinePaths.includes(url);

        if (url === '/demand/omnationale' || url === '/demand/ominternationale') {
          const deepestRoute = this.getDeepestRoute(this.activatedRoute);
          const title = deepestRoute.snapshot.data['title'] || 'OM';
          this.pageTitle = title;
          sessionStorage.setItem('cachedPageTitle', title);
        } else if (isTimelinePage) {
          const cached = sessionStorage.getItem('cachedPageTitle');
          this.pageTitle = cached || 'Nouvelle demande OM';
        } else {
          const deepestRoute = this.getDeepestRoute(this.activatedRoute);
          const title = deepestRoute.snapshot.data['title'];
          this.pageTitle = title ? title : 'Tableau de bord';
          sessionStorage.removeItem('cachedPageTitle');
        }
      });
  }
 /* ngOnInit(): void {
    this.userProfile = this.userService.getUserProfile();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleSidbarMenuEvent(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarOpenEvent.emit(this.isSidebarOpen);
  };

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  logout(): void {
    this.keycloakService.logout();
  }*/

  isMenuVisible = false;
  pageTitle = '';
  isDashboardPage = true;
  timelinePaths = [
    '/demand/companions',
    '/demand/perdiem',
    '/demand/vehicle-reservation',
    '/demand/ticket-reservation',
    '/demand/shuttle-reservation',
    '/demand/summary'
  ];

  getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateTo(route: string): void {
    sessionStorage.setItem('selectedMenu', '1');
    sessionStorage.setItem('selectedSubMenu', route);
    this.router.navigate(['/' + route]).then(() => {
      const deepestRoute = this.getDeepestRoute(this.activatedRoute);
      const title = deepestRoute.snapshot.data['title'];
      this.pageTitle = title ? title : 'Tableau de bord';
      this.isMenuVisible = false;
    });
  }

}

