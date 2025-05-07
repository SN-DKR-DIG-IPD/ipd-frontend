import { Component, Prop, h } from '@stencil/core';

// class NavItem {
//   constructor(
//   public id: string,
//   public label: string,
//   public icon: string){}
// }

@Component({
  tag: 'jbpm-app-sidebar',
  styleUrl: 'jbpm-app-sidebar.css',
  shadow: true,
})
export class JbpmAppSidebar {
  @Prop() sidebarSlogan: string = 'l•••••p';
  @Prop() sidebarTitle: string = 'Business Process<br/>Management';
  @Prop() navItems: any = [
    { id: 'Demandes', label: 'Demandes', icon: 'home' },
    { id: 'Reporting', label: 'Reporting', icon: 'file-text' },
    { id: 'Audit', label: 'Audit', icon: 'alert-circle' },
    { id: 'Taks', label: 'Tasks', icon: 'alert-circle' },
    { id: 'Configuration', label: 'Configuration', icon: 'settings' },
  ];
   @Prop() activeNav: string = 'Demandes';
  isConfigOpen: boolean = false;
  setActiveNav(navId: string): void {
    if (navId === 'Configuration') {
      this.isConfigOpen = !this.isConfigOpen;
    }
    this.activeNav = navId;
  }

  getNavItemClass(navId: string): string {
    const baseClass = 'text-[#06021E] w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200  text-[15px]';
    return `${baseClass} ${
      this.activeNav === navId
        ? 'bg-[#00005C] text-white font-semibold' 
        : 'text-blue-300 hover:bg-blue-400'
    }`;
  }

  getNavItemIClass(){
    let baseClass = 'fas fa-chevron-down transition-transform duration-200'
    if(this.isConfigOpen && this.activeNav === 'Configuration'){
      baseClass =`${baseClass} rotate-180`
    }
    return baseClass
  }

   renderConditionalConfiguration(isConfig= false){
      if(isConfig){
        return (
          <i
            class={this.getNavItemIClass()}
          >
          </i>
        )
      }
   }

   renderNavItems(){
    return (this.navItems.map((e)=>{ <div>{e.label}</div>}))
   }

  render() {
    return (
<div>
    {this.renderNavItems()}
</div>
    );
  }

}
