import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnifiedAuthService } from '../../../core/service/unified-auth.service';

@Component({
  selector: 'app-jbpm-dashboard',
  templateUrl: './jbpm-dashboard.component.html',
  styleUrl: './jbpm-dashboard.component.scss'
})
export class JbpmDashboardComponent implements OnInit {
  group: string | undefined;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private unifiedAuthService: UnifiedAuthService
  ) {
    this.group = this.route.snapshot.params['group'];
  }

  ngOnInit(): void {
    // Vérifier l'accès au groupe si spécifié
    if (this.group) {
      this.checkGroupAccess();
    }
  }

  private checkGroupAccess(): void {
    // Vérifier si l'utilisateur a accès au groupe
    const hasGroupAccess = this.unifiedAuthService.hasGroup(this.group!);
    
    if (!hasGroupAccess) {
      console.log(`❌ Accès refusé au groupe: ${this.group}`);
      // Rediriger vers une page d'erreur ou le dashboard principal
      this.router.navigate(['/dashboard']);
    } else {
      console.log(`✅ Accès autorisé au groupe: ${this.group}`);
    }
  }
}
