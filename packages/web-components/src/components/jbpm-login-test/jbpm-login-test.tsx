import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'jbpm-login-test',
  styleUrl: 'jbpm-login-test.css',
})
export class JbpmLoginTest {
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
  
 
  render() {
    return (
            <div class="bg-gray-100">
                <p>Simple test</p>
            </div>
    );
  }

}
