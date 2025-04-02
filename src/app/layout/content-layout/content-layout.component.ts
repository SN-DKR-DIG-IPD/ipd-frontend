import { Component } from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {NgClass} from "@angular/common";
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
  ],
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent {
  reduce = false;

  onReduceChange(reduce: boolean) {
    console.log("recu ", reduce)
    this.reduce = reduce;
  }
}
