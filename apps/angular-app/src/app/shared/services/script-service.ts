import { Renderer2, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
 
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }
 
 /**
  * Append the JS tag to the Document Body.
  * @param renderer The Angular Renderer
  * @param element The path to the script
  * @returns the script element
  */
  public loadJsScript(renderer: Renderer2, element:HTMLScriptElement | string, onlyScriptWithoutLink=false): HTMLScriptElement {
    try{
    const script = renderer.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute("defer", "defer");
    if(element instanceof HTMLScriptElement){
      if(element.src && !onlyScriptWithoutLink){
        script.src = element.src;
      }
      else if(onlyScriptWithoutLink){
        script.innerText = element.innerText;
      }
      else {
        // script.innerText = element.innerText;
      }
    }
    else{
        if(element.startsWith('http://')||element.startsWith('https://') ){
          script.src = element;
        }else{
          script.innerText = element;
        }
    }
    renderer.appendChild(this.document.body, script);
    return script;
    }
    catch(e){
        return new HTMLScriptElement()
    }

  }
}