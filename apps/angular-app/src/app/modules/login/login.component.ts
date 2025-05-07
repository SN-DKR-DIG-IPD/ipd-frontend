import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { IAccountAPI, IDefaultConfigAPI } from '@jbpm/domain';
import { AccountAPI, BPMDefaultConfigAPI } from '../../injections';
import { Login } from '../../shared/models/login.model';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  login= new Login()
  @ViewChild('form') form!: NgForm;
  isLoading = false;
  error = false;
  loadingText = 'Connexion en cours...';
  userCredentials: FormGroup|undefined;

  constructor(
		private router: Router,
		@Inject(AccountAPI) private accountAPI: IAccountAPI,
		@Inject(BPMDefaultConfigAPI) private bpmDefaultConfigAPI: IDefaultConfigAPI,
	) {}

	ngOnInit(): void {
    this.userCredentials = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

	clearForm() {
    this.userCredentials = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
	}
  get usernameCtrl() {
    return this.userCredentials?.get('username');
  }
  get passwordCtrl() {
    return this.userCredentials?.get('password');
  }

  formSubmitted = false;

  async onSubmit() {
    this.formSubmitted = true;

    if (this.userCredentials?.invalid) {
      this.error = true;
      this.isLoading = false;
      this.loadingText = "Veuillez remplir tous les champs requis.";
      return;
    }

    this.isLoading = true;
    try {
      await this.accountAPI.authenticate(
        this.userCredentials?.get('username')?.value,
        this.userCredentials?.get('password')?.value
      );

      const defaultHeader = {
        Authorization: 'Basic ' + this.accountAPI.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      };

      sessionStorage.setItem('username', JSON.stringify(this.userCredentials?.get('username')?.value));
      sessionStorage.setItem('defaultHeader', JSON.stringify(defaultHeader));
      this.bpmDefaultConfigAPI.setDefaultHeaders(defaultHeader);

      this.error = false;
      this.redirect();
    } catch (e) {
      this.clearForm();
      this.error = true;
      this.loadingText = e as string;
    }

    this.clearForm();
  }


  redirect() {
    	this.isLoading = false;
		this.router.navigate(['home']).then(r => r);
    console.log("** redirected")
	}
}
