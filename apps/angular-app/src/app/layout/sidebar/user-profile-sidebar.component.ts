import { UnifiedAuthService } from '../../core/service/unified-auth.service';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private unifiedAuthService: UnifiedAuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.unifiedAuthService.logout();
  }
} 