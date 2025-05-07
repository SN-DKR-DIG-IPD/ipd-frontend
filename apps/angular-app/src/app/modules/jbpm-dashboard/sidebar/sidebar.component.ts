import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  SharedStyleServiceService, StyleConfig, Theme,
  // StyleConfig
} from "../../../shared/services/styleConfig/shared-style-service.service";
import {Subscription} from "rxjs";




@Component({
  selector: 'jbpmm-app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit,OnDestroy {

  constructor(private router: Router, private sharedStyleService: SharedStyleServiceService) {}
  styles!: StyleConfig;
  activeNav: string = '';
  isConfigOpen: boolean = false;
  activeTheme!: Theme
  private themeSubscription!: Subscription;

  // activeNav: string = 'Demandes';
  // isConfigOpen: boolean = false;
  predefinedBgColors = ['bg-gray-50', 'bg-gray-100', 'bg-white'];


  navItems = [
    { id: 'Demandes', label: 'SIDEBAR.Request', icon: 'home', route:'/jbpm-dashboard' },
    { id: 'demandes_de_groupe', label: 'SIDEBAR.Group', icon: 'group', route:'/jbpm-dashboard/group' },
    { id: 'Reporting', label: 'SIDEBAR.Reporting', icon: 'bar_chart', route:'/jbpm-dashboard/reporting' }, //route to define
    { id: 'Audit', label: 'SIDEBAR.Audit', icon: 'assignment', route:'' },
    { id: 'Taks', label: 'SIDEBAR.Tasks', icon: 'task', route:'' },
    { id: 'Configuration', label: 'SIDEBAR.config.title', icon: 'settings',  },
  ];

  configOptions = [
    'Paramètres généraux',
    'Utilisateurs',
    'Rôles et permissions',
    'Notifications'
  ];

  ngOnInit(): void {
    this.themeSubscription = this.sharedStyleService.activeTheme$.subscribe(
      theme => {
      this.activeTheme = theme;
    }
    );
  }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  setActiveNav(nav:any): void {
    this.activeNav = nav.id;
    if (nav.id === 'Configuration') {
      this.isConfigOpen = !this.isConfigOpen;
    }
    // this.activeNav = nav.id;
    this.router.navigate([nav.route])
  }

  // default navbar item class
  // getNavItemClass(navId: string): string {
  //   const baseClass = 'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200  text-[15px]';
  //   return `${baseClass} ${
  //     this.activeNav === navId
  //       ? `bg-red-50 border-l-4 border-red-600 font-medium  ${this.styles.navItemActiveColor}`
  //       : `${this.styles.navItemColor} hover:bg-red-50`
  //   }`;
  // }

  getNavItemClass(itemId: string): string {
    const baseClasses = 'flex items-center justify-between w-full px-4 py-2 text-left rounded-lg transition-colors';
    const activeClasses = this.activeNav === itemId
      ? `${this.activeTheme.sidebar.activeNavItemBg} ${this.activeTheme.sidebar.activeNavItemTextColor}`
      : `${this.activeTheme.sidebar.navItemHover} ${this.activeTheme.sidebar.navItemTextColor}`;

    return `${baseClasses} ${activeClasses}`;
  }

  getSidebarColors() {
    return {
      background: this.activeTheme?.sidebar.customColors?.background || this.activeTheme?.sidebar.background,
      logoText: this.activeTheme?.sidebar.customColors?.logoText || this.activeTheme?.sidebar.logoTextColor,
      itemText: this.activeTheme?.sidebar.customColors?.itemText || this.activeTheme?.sidebar.navItemTextColor,
      activeItemText: this.activeTheme?.sidebar.customColors?.activeItemText || this.activeTheme?.sidebar.activeNavItemTextColor,
      activeItemBg: this.activeTheme?.sidebar.customColors?.activeItemBg || this.activeTheme?.sidebar.activeNavItemBg
    };
  }

  isItemActive(itemId: string): boolean {
    return this.activeNav === itemId;
  }

  // getIconClass(navId: string): string {
  //   return this.activeNav === navId ? 'text-white' : 'text-[#E4E4E7]/90 hover:bg-blue-400';
  // }

  // getIconClass(navId: string): string {
  //   return this.activeNav === navId
  //     ? this.styles.navItemActiveColor
  //     : `${this.styles.navItemColor} hover:bg-blue-400`;
  // }

}
