import { Injectable } from '@angular/core';
import {NavigationTabModel} from "../../../data/models/NavigationTab.model";

@Injectable({
  providedIn: 'root',
})
export class TabNavigationService {
  navigationTabs!: NavigationTabModel[];

  initNavigationTabs(): NavigationTabModel[] {
    this.navigationTabs = [
      {
        index: 1,
        label: 'Tableau de bord',
        icon: 'layout-dashboard',
        route: '/dashboard',
      },
      {
        index: 2,
        label: 'Demande d\'OM',
        icon: 'copy',
        route: '/dashboard',
        subMenu: ['OM nationale', 'OM internationale']
      },
      {
        index: 3,
        label: 'Actions spécifiques',
        icon: 'folder-plus',
        route: '/dashboard',
        subMenu: ['Sous-menu A', 'Sous-menu B']
      },
      {
        index: 4,
        label: 'Reporting',
        icon: 'proportions',
        route: '/dashboard',
      }
    ]
    return this.navigationTabs;
  }
}
