import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, RouterLink} from "@angular/router";
import {LucideAngularModule} from "lucide-angular";
import {filter} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  public breadcrumbs: BreadCrumb[] = [];
  ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  ROUTE_DATA_LINK = 'link';
  isLoadingLastBreadcrumb = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      let root: ActivatedRoute = this.activatedRoute.root;
      this.getBreadcrumbs(root).then(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      });
    });
  }

  private async getBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadCrumb[] = []
  ): Promise<BreadCrumb[]> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      if (!child.snapshot.data.hasOwnProperty(this.ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      let breadcrumbLabel = child.snapshot.data[this.ROUTE_DATA_BREADCRUMB];

      if(breadcrumbLabel === ''){
        this.isLoadingLastBreadcrumb = true;
      }

      // Ajouter le breadcrumb seulement si le label n'est pas déjà présent
      if (!breadcrumbs.some(bc => bc.label === breadcrumbLabel)) {
        breadcrumbs.push({
          label: breadcrumbLabel,
          params: child.snapshot.params,
          url: child.snapshot.data[this.ROUTE_DATA_LINK] || this.router.url,
        });
      }

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
interface BreadCrumb {
  label: string;
  params?: { [key: string]: any };
  url: string;
}
