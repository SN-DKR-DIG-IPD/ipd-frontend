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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ContentLayoutComponent } from '../layout/content-layout/content-layout.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { InputComponent } from './components/input/input.component';
import { ControlValueAccessorDirective } from './directives/control-value-accessor.directive';
import { SelectComponent } from './components/select/select.component';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { ModalComponent } from './components/modal/modal.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { HtmlDirective } from './directives/html.directive';
import {BreadcrumbComponent} from "../layout/breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [
    ContentLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    InputComponent,
    SelectComponent,
    ControlValueAccessorDirective,
    HtmlDirective,
    SafeHtmlPipe,
    ValidationErrorsComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    LucideAngularModule.pick({
      ChevronsLeft, ChevronsRight,
      Equal, ChevronLeft, ChevronRight,
      Settings, CheckCheck,
      Bell, BadgeCheck,
      Plus, LayoutDashboard, Copy, FolderPlus, Proportions, Printer, Slash, CircleUser, LockKeyhole, LogOut, Minus,
      Globe, GlobeLock, Combine, CircleEllipsis, Pen, Eye
    }),
    BreadcrumbComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NgxPermissionsModule,
    ContentLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    InputComponent,
    SelectComponent,
    ModalComponent,
    ControlValueAccessorDirective,
    HtmlDirective,
    SafeHtmlPipe,
    ValidationErrorsComponent
  ]
})
export class SharedModule { }












