import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TabNavigationService} from "../../core/service/sidebar/tab-navigation.service";
import {NavigationTabModel} from "../../data/models/NavigationTab.model";
import {RouterLink, RouterLinkActive} from "@angular/router";

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
  reduce= false
  menuItems!: NavigationTabModel[];
  @Output() reduceChange = new EventEmitter<boolean>();

constructor(private tabNavigationService: TabNavigationService) {
}

  ngOnInit() {
    this.initTabMenus();
  }

  private initTabMenus(): void {
    this.menuItems = this.tabNavigationService.initNavigationTabs();
  }
  toggleSubMenu(index: number): void {
    this.selectedMenuIndex = this.selectedMenuIndex === index ? null : index;
  }
  goTo(index: number): void {
    this.selectedMenu = index;
  }

  reduceSidebar() {
    this.reduce = !this.reduce;
    if (this.reduce) {
      this.selectedMenuIndex = -1;
    }
    this.reduceChange.emit(this.reduce);
  }
}
