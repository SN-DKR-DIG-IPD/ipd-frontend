import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { AuthService } from '../../core/service/user/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() isSidebarOpen = false;
  @Output() isSidebarOpenEvent = new EventEmitter<boolean>();

  isOpen = false;

  constructor(
    private authService: AuthService,
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

  ngOnInit() {
    // Les observables sont déjà initialisés dans le constructeur
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
    // À adapter selon ta logique de déconnexion
    // Par exemple, vider le storage et recharger la page
    sessionStorage.clear();
    window.location.href = '/login';
  }

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

