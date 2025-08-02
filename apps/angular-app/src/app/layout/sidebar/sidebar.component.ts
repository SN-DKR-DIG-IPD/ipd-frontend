import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UnifiedAuthService } from '../../core/service/unified-auth.service';
import { TabNavigationService } from '../../core/service/sidebar/tab-navigation.service';
import { NavigationTabModel } from '../../data/model/NavigationTab.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() reduceChange = new EventEmitter<boolean>();
  
  isCollapsed = false;
  isReduced = false;
  username$: Observable<string | null>;
  roles$: Observable<string[]>;
  groups$: Observable<string[]>;
  
  selectedMenuIndex: number | null = null;
  selectedMenu: number = 0;
  selectedSubMenu: string = '';
  menuItems!: NavigationTabModel[];

  constructor(
    private router: Router,
    private unifiedAuthService: UnifiedAuthService,
    private tabNavigationService: TabNavigationService
  ) {
    this.username$ = this.unifiedAuthService.getUsername$();
    this.roles$ = this.unifiedAuthService.getRoles$();
    this.groups$ = this.unifiedAuthService.getGroups$();
  }

  ngOnInit(): void {
    this.initTabMenus();
    const storedMenu = sessionStorage.getItem('selectedMenu');
    const storedSubMenu = sessionStorage.getItem('selectedSubMenu');
    if (storedMenu) {
      this.selectedMenu = parseInt(storedMenu, 10);
    }
    if (storedSubMenu) {
      this.selectedSubMenu = storedSubMenu;
    }
  }

  private initTabMenus(): void {
    this.menuItems = this.tabNavigationService.initNavigationTabs();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isReduced = !this.isReduced;
    this.reduceChange.emit(this.isReduced);
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
    sessionStorage.setItem('selectedMenu', this.selectedMenu.toString());
    sessionStorage.setItem('selectedSubMenu', this.selectedSubMenu);
  }

  selectSubMenu(route: string) {
    this.selectedSubMenu = route;
    sessionStorage.setItem('selectedSubMenu', this.selectedSubMenu);
  }

  logout(): void {
    this.unifiedAuthService.logout();
  }
}
