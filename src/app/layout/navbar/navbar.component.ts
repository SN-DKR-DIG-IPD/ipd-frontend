import { Component } from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LucideAngularModule,
    BreadcrumbComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
