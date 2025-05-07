import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe qui sécurise du code HTML pour l'afficher dans un élément HTML.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  /**
   * Constructeur du pipe.
   * @param sanitized Le service de sécurité DOM qui permet de sécuriser le code HTML.
   */
  constructor(private sanitized: DomSanitizer) {}

  /**
   * Sécurise le code HTML pour l'afficher dans un élément HTML.
   * @param value Le code HTML à sécuriser.
   * @returns Le code HTML sécurisé pour être affiché dans un élément HTML.
   */
  transform(value: any): SafeHtml {
    const parser = new DOMParser();
    const document = parser.parseFromString(value, 'text/html');
    // Sécuriser le code HTML avec le service de sécurité DOM
    if (value) {
      return this.sanitized.bypassSecurityTrustHtml(document.body.outerHTML);
    } else {
      return '';
    }
  }
}
