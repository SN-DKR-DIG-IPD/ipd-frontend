import { Component, h} from '@stencil/core';

@Component({
  tag: 'jbpm-dashboard',
  styleUrl: 'jbpm-dashboard.css',
  shadow: true,
})
export class JbpmDashboard {

  render() {
    return (
      <div class="min-h-screen  bg-[#F8FAFC]">
          {/* sidebar */} 
          <slot name="app-sidebar" />
        <div class="flex-1 ml-64"> 
          {/* app-navbar */} 
          <slot name="app-navbar" />
          {/* app-demande */} 
          <slot name="app-demande" />
        </div>
      </div>
    )
  }

}
