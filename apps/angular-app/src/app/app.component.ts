import { Component, Inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { UserService } from './core/service/user/user.service';
import { AccountAPI, BPMDefaultConfigAPI} from './injections';
import { KeycloakProfile } from 'keycloak-js';
import type { IAccountAPI, IContainerAPI, IDefaultConfigAPI } from '@jbpm/domain';
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private keycloakService: KeycloakService,
    private permissionsService: NgxPermissionsService,
    private ngxRolesService: NgxRolesService,
    private userService: UserService,
		@Inject(AccountAPI) private accountAPI: IAccountAPI,
		@Inject(BPMDefaultConfigAPI) private bpmDefaultConfigAPI: IDefaultConfigAPI, private translate: TranslateService
  ) {
    translate.setDefaultLang('fr');
  }

  public async ngOnInit() {
    // const isLoggedIn = await this.keycloakService.isLoggedIn();

    // if (isLoggedIn) {
    //   await this.keycloakService.loadUserProfile().then((userProfile: KeycloakProfile) => {
    //     this.userService.setUserProfile(userProfile);
    //   });
    //   const roles = await this.keycloakService.getUserRoles();
    //   // @TODO replace roles with permissions
    //   this.permissionsService.loadPermissions(roles);
    // }
      this.permissionsService.loadPermissions(['SUPER_ADMIN']);
    await (async () => {
      this.bpmDefaultConfigAPI.setAPIBaseUrl(environment.bpmAPIBaseUrl)
      this.bpmDefaultConfigAPI.setBusinessCentralAPIBaseUrl(environment.businessCentralAPIBaseUrl)
    })()

  }



}
