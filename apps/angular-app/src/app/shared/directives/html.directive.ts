import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Directive({
  selector: '[html]',
})
export class HtmlDirective implements OnChanges {
  private _uniqueId: string='';

  @Input()
  public html: string|SafeHtml='';

  constructor(private _elementRef: ElementRef, private _router: Router) {}

  public ngOnChanges(): void {
    if (this.html && this.html!=='') {
      this._uniqueId ||= [...this._elementRef.nativeElement.attributes].find(
        (attr) => attr.name.startsWith('_ngcontent-')
      ).name;

      this._elementRef.nativeElement.innerHTML = this.html;

      const descandants = this._elementRef.nativeElement.querySelectorAll('*');

      for (const element of descandants) {
        element.setAttribute(this._uniqueId, '');

        if (element.tagName === 'A') {
          const href: string = element.href?.toLowerCase();

          if (href?.startsWith(location.origin.toLowerCase())) {
            element.addEventListener('click', (e: MouseEvent) => {
              this._router.navigate([href.substring(location.origin.length)]);
              e.preventDefault();
            });
          }
        }
      }
    } else {
      this._elementRef.nativeElement.innerHTML = null;
    }
  }
}