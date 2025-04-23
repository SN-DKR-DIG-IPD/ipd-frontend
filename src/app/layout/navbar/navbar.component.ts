import {Component, OnInit} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {NgIf} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {filter, map} from "rxjs";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LucideAngularModule,
    BreadcrumbComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
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

  ngOnInit(): void {
    }


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
