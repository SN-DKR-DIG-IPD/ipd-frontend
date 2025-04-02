import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {LucideAngularModule} from "lucide-angular";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

}
