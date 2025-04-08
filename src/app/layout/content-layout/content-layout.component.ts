import { Component } from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {NgClass, NgIf} from "@angular/common";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {TimelineComponent} from "../timeline/timeline.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-content-layout',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgClass,
    BreadcrumbComponent,
    TimelineComponent,
    SidebarComponent,
    NavbarComponent,
    RouterOutlet,
    NgIf,
  ],
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent {
  reduce = false;
  showmenu = false;

  onReduceChange(reduce: boolean) {
    this.reduce = reduce;
  }

  showMenu() {
    this.showmenu = !this.showmenu;
  }
}
