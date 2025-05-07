import {Component, Prop, h, State} from '@stencil/core';


@Component({
  tag: 'app-sidebar',
  styleUrl: 'app-sidebar.css',
  shadow: true,
})
export class AppSidebar {
  @Prop({mutable: true}) logo:string = '';
  @Prop() width: string = '64';
  @State() items: Array<{ label: string;  link: string; }> = [

  ]
  @Prop() position: 'left' | 'right' = 'left';
  @Prop({mutable: true}) isOpen: boolean = false;

  @Prop() showDropdownButton: boolean = false;
  @State() isDropdownOpen: boolean = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }


  render() {
    const sidebarPositionClass = this.position === 'left' ? 'left-0' : 'right-0';
    const sidebarOpenClasses = this.isOpen ? 'w-' + this.width : 'w-0';
    return(
      <div class={`flex-col bg-gray-800 md:flex fixed h-full top-0 ${sidebarPositionClass} ${sidebarOpenClasses}`}>
        <div class="flex h-16 items-center justify-center bg-blue-900">
          <span class="font-bold text-white">{this.logo}</span>
          <button onClick={() => this.toggleSidebar()}>
            {this.isOpen ? '←' : '→'}
          </button>
        </div>
        <div class="flex flex-1 flex-col h-full">
          <nav class="flex-1 bg-gray-100 px-2 py-4">
            <ul class="mt-12 space-y-4">
              {this.items.map(item => (
                <li class="px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors">

                  <a href={item.link} class="text-lg">{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

        </div>
      </div>
    )
  }
}


