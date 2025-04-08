import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TabNavigationService } from '../../core/service/sidebar/tab-navigation.service';
import { NavigationTabModel } from '../../data/models/NavigationTab.model';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgClass,
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  selectedMenuIndex: number | null = null;
  selectedMenu: number = 0;
  selectedSubMenu: string = '';
  reduce = false;
  menuItems!: NavigationTabModel[];

  @Output() reduceChange = new EventEmitter<boolean>();

  constructor(
    private tabNavigationService: TabNavigationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initTabMenus();

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.url;
      this.highlightCurrentRoute(currentRoute);
    });

    this.highlightCurrentRoute(this.router.url);
  }

  private initTabMenus(): void {
    this.menuItems = this.tabNavigationService.initNavigationTabs();
  }

  toggleSubMenu(index: number): void {
    this.selectedMenuIndex = this.selectedMenuIndex === index ? null : index;
  }

  goTo(index: number): void {
    const item = this.menuItems[index];

    if (!item.subMenu || item.subMenu.length === 0) {

      this.selectedMenu = index;
      this.selectedSubMenu = '';
    } else {

      this.selectedMenu = index;
    }

    if (this.reduce) {
      const selectedSubMenu = item.subMenu?.find(sub => sub.route === this.selectedSubMenu);
      if (selectedSubMenu) {
        this.selectedSubMenu = selectedSubMenu.route;
      }
    }
  }


  reduceSidebar() {
    this.reduce = !this.reduce;
    this.reduceChange.emit(this.reduce);
  }

  selectSubMenu(route: string) {
    this.selectedSubMenu = route;
  }
  private highlightCurrentRoute(route: string) {
    let found = false;

    this.menuItems.forEach((item, index) => {
      if (item.subMenu) {
        const foundSub = item.subMenu.find(sub => route.includes(sub.route));
        if (foundSub) {
          this.selectedMenu = index;
          this.selectedMenuIndex = index;
          this.selectedSubMenu = foundSub.route;
          found = true;
        }
      }
    });


    if (!found) {
      this.menuItems.forEach((item, index) => {
        if (item.route && route.includes(item.route)) {
          this.selectedMenu = index;
          this.selectedMenuIndex = null;
          this.selectedSubMenu = '';
          found = true;
        }
      });
    }

    if (!found) {
      this.selectedMenu = 0;
      this.selectedMenuIndex = null;
      this.selectedSubMenu = '';
    }
  }

}
