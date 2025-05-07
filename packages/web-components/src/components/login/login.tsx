import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
@Component({
    tag: 'jbpm-login',
    styleUrl: './login.css',
    shadow: true
  })
  
  export class Login {
    @Prop() bgImg: string = 'https://media.istockphoto.com/id/642501464/photo/wonderful-ill-see-you-first-thing-on-monday.jpg?s=1024x1024&w=is&k=20&c=YIhPhT6ZrGe8J_5NIZ9eroXQvio7VoSNsm8N80H-n3A=';
    @Prop() formTitle: string = 'Connectez-vous à loooop.';
    @Prop() formDescription: string = 'Connectez-vous à votre espace loooop pour une gestion simple et fluide de vos processus d\'approbation.';
    @Prop() userLabel: string = 'Login';
    @Prop() userPlaceholder: string= 'Saisissez votre login';
    @Prop() passwordLabel: string = 'Mot de passe';
    @Prop() passwordPlaceholder: string = 'Saisissez votre mot de passe';
    @Prop() submitBtnText: string = 'Se connecter';
    @Prop() forgetPasswrdText: string = 'Mot de passe oublié ?';

    @Prop() username: string;
    @Prop() password: string;

    @Event({ eventName: 'signSubmited' }) signSubmited: EventEmitter<any>;

    handleSubmit(e) {
      e.preventDefault();
      this.signSubmited.emit({
        username: this.username,
        password: this.password,
      });
    }
  
    handleUserChange(event) {
      this.username = event.target.value;
    }
  
    handlePassChange(event) {
      this.password = event.target.value;
    }
  
  
    render(){
        return (
            <div class="bg-gray-100">
                <div class="flex h-screen">
                  {/* Partie gauche avec l'image */}
                  <div style={{ 'background-image': `url(${this.bgImg})` }}  class="fond w-1/2 bg-bottom bg-gray-800 flex flex-col justify-center items-center text-white p-10">

                  </div>

                  {/* Partie droite avec le formulaire de connexion */}
                  <div class="w-1/2 bg-white flex justify-center items-center p-10">
                    <div class="w-full max-w-md">
                      <h2 class="text-md font-bold mb-6 text-blue-600">{this.formTitle}</h2>
                      <p class="text-gray-600 mb-4">{this.formDescription}</p>
                      <form onSubmit={e => this.handleSubmit(e)}>
                        <div class="mb-4">
                          <label htmlFor="user" class="block text-sm font-bold mb-2">{this.userLabel}</label>
                          <input type="user" id="user" name="user" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" value={this.username} placeholder={this.userPlaceholder} onInput={event => this.handleUserChange(event)} required/>
                        </div>

                        <div class="mb-6">
                          <label htmlFor="password" class="block text-sm font-bold mb-2">{this.passwordLabel}</label>
                          <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" value={this.password} placeholder={this.passwordPlaceholder} onInput={event => this.handlePassChange(event)} required/>
                        </div>

                        <button  class="w-full bg-blue-600 text-white py-2 rounded-3xl hover:bg-blue-700">{this.submitBtnText}</button>

                        <div  class="text-center mt-4">
                          <slot name="reset-password-component" />
                          {/*<a  routerLinkActive={"router-link-active"}  class="text-blue-600 hover:underline">{this.forgetPasswrdText}</a>*/}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
        )
    }
  }