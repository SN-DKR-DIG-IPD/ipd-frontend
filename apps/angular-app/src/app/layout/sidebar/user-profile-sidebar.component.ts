import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-user-profile-sidebar',
  templateUrl: './user-profile-sidebar.component.html',
  styleUrls: ['./user-profile-sidebar.component.scss']
})
export class UserProfileSidebarComponent {
  @Input() username: string = '';
  @Input() roles: string[] = [];
  @Input() groups: string[] = [];
  @Input() avatarUrl?: string;
  @Input() isSidebarReduced: boolean = false;

  menuOpen = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-dropdown')) {
      this.menuOpen = false;
    }
  }

  onLogout() {
    sessionStorage.clear();
    window.location.href = '/login';
  }
} 