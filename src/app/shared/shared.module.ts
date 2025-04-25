import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  BadgeCheck,
  Bell, CheckCheck, ChevronLeft, ChevronRight,
  ChevronsLeft,
  ChevronsRight, CircleEllipsis,
  CircleUser, Combine,
  Copy,
  Equal, Eye,
  FolderPlus, Globe,
  GlobeLock,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  LucideAngularModule,
  Minus, Pen,
  Plus,
  Printer,
  Proportions,
  Settings,
  Slash
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
      Equal, ChevronLeft, ChevronRight,
      Settings, CheckCheck,
      Bell, BadgeCheck,
      Plus, LayoutDashboard, Copy, FolderPlus, Proportions, Printer, Slash, CircleUser, LockKeyhole, LogOut, Minus,
      Globe, GlobeLock, Combine, CircleEllipsis, Pen, Eye
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
