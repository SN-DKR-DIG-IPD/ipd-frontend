import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationEnd, Router } from "@angular/router";
import { TabNavigationService } from "../../core/service/sidebar/tab-navigation.service";
import { NavigationTabModel } from "../../data/model/NavigationTab.model";
import { filter } from "rxjs";
import { AuthService } from '../../core/service/user/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isSidebarOpen = false;
  @Output() isSidebarOpenEvent = new EventEmitter<boolean>();
  mobileQuery: MediaQueryList;
  isReduced: boolean = false;

  username$!: Observable<string|null>;
  roles$!: Observable<string[]>;
  groups$!: Observable<string[]>;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private tabNavigationService: TabNavigationService,
    private router: Router,
    private authService: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", () => {
      this._mobileQueryListener();
    });
  }

  private _mobileQueryListener: () => void;

  selectedMenuIndex: number | null = null;
  selectedMenu: number = 0;
  selectedSubMenu: string = '';
  reduce = false;
  menuItems!: NavigationTabModel[];
  @Output() menuSelected = new EventEmitter<{ menu: NavigationTabModel, subMenu?: string }>();
  @Output() reduceChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.initTabMenus();
    this.username$ = this.authService.getUsername$();
    this.roles$ = this.authService.getRoles$();
    this.groups$ = this.authService.getGroups$();
    const storedMenu = sessionStorage.getItem('selectedMenu');
    const storedSubMenu = sessionStorage.getItem('selectedSubMenu');
    if (storedMenu) {
      this.selectedMenu = parseInt(storedMenu, 10);
    }
    if (storedSubMenu) {
      this.selectedSubMenu = storedSubMenu;
    }
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
    sessionStorage.setItem('selectedMenu', this.selectedMenu.toString());
    sessionStorage.setItem('selectedSubMenu', this.selectedSubMenu);
  }

  reduceSidebar() {
    this.reduce = !this.reduce;
    if (this.reduce) {
      this.selectedMenuIndex = -1;
    }
    this.reduceChange.emit(this.reduce);
  }

  selectSubMenu(route: string) {
    this.selectedSubMenu = route;
  }

  toggleSidebar() {
    this.isReduced = !this.isReduced;
  }

  private highlightCurrentRoute(route: string) {
    let found = false;
    if (this.selectedSubMenu && route.startsWith(`/${this.selectedSubMenu}`)) {
      return;
    }
    for (let [index, item] of this.menuItems.entries()) {
      if (item.subMenu) {
        const foundSub = item.subMenu.find(sub => route.startsWith(`/${sub.route}`));
        if (foundSub) {
          this.selectedMenu = index;
          this.selectedMenuIndex = index;
          this.selectedSubMenu = foundSub.route;
          found = true;
          break;
        }
      }
    }
    if (!found && this.selectedSubMenu && route.startsWith(`/${this.selectedSubMenu.split('/')[0]}`)) {
      return;
    }
    if (!found) {
      for (let [index, item] of this.menuItems.entries()) {
        if (item.route && route.startsWith(item.route)) {
          this.selectedMenu = index;
          this.selectedMenuIndex = null;
          this.selectedSubMenu = '';
          found = true;
          break;
        }
      }
    }
    if (!found) {
      this.selectedMenu = 0;
      this.selectedMenuIndex = null;
      this.selectedSubMenu = '';
    }
  }
}
