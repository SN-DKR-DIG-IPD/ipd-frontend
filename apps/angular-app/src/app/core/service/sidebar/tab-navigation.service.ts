import { Injectable } from '@angular/core';
import {NavigationTabModel} from "../../../data/model/NavigationTab.model";

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
        subMenu: [
          {
            index: 1,
            label: 'OM nationale',
            route:'/demand/omnationale'
          },
          {
            index: 2,
            label: 'OM internationale',
            route:'/demand/ominternationale'
          },
        ]
      },
      {
        index: 3,
        label: 'Actions spécifiques',
        icon: 'folder-plus',
        route: '',
      },
      {
        index: 4,
        label: 'Reporting',
        icon: 'proportions',
        route: '',
      }
    ]
    return this.navigationTabs;
  }
}
