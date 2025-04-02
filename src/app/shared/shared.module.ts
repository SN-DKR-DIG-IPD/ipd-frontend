import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Bell, ChevronsLeft, ChevronsRight, CircleUser, Copy, Equal, FolderPlus, LayoutDashboard, LockKeyhole, LogOut,
  LucideAngularModule, Minus, Plus, Printer, Proportions, Settings, Slash
} from "lucide-angular";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {SidebarComponent} from "../layout/sidebar/sidebar.component";
import {BreadcrumbComponent} from "../layout/breadcrumb/breadcrumb.component";
import {ContentLayoutComponent} from "../layout/content-layout/content-layout.component";
import {TimelineComponent} from "../layout/timeline/timeline.component";
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ContentLayoutComponent,
    TimelineComponent,
    LucideAngularModule.pick({
      ChevronsLeft, ChevronsRight,
      Equal,
      Settings,
      Bell,
      Plus, LayoutDashboard, Copy, FolderPlus, Proportions, Printer, Slash, CircleUser, LockKeyhole, LogOut, Minus
    }),
    NgOptimizedImage,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ContentLayoutComponent,
    TimelineComponent,
    TranslateModule
  ],
  providers: []
})
export class SharedModule { }
