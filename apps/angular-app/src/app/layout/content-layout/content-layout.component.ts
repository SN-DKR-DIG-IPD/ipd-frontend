import { ThemeService } from '../../core/service/theme/theme.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ThemeModel } from '../../data/model/theme.model';
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit{

  public isSidebarOpen = false;
  public isSettingsPanelOpen = false;

  theme: ThemeModel;

  reduce = false;
  showmenu = false;
  currentRoute = false;
  userProfile!: string | null
  userRole: string = ''
  isTimeline: boolean = false
  step: number = 0;

  constructor(private themeService: ThemeService, private keycloakService: KeycloakService, private cdr: ChangeDetectorRef, private router: Router) {
    this.theme = this.themeService.theme$.getValue();
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url.includes('dashboard');

    /*this.keycloakService.loadUserProfile().then(result => {
      this.userProfile = result
    })*/
    const rawUsername = sessionStorage.getItem('username') || '';
    this.userProfile = rawUsername.replace(/"/g, '');
  }

  onReduceChange(reduce: boolean) {
    this.reduce = reduce;
  }

  showMenu() {
    this.showmenu = !this.showmenu;
  }
  logout(){
    sessionStorage.clear();
    this.redirect()
  }

  redirect() {
    this.router.navigate(['login']).then(r => console.log(r));
  }
}
