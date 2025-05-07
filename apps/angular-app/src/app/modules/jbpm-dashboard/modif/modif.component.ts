import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, HostListener, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { ScriptService } from '../../../shared/services/script-service';
import { DocumentInstancesType, DocumentInstanceType, TasKStatus } from '@jbpm/domain';
import {saveAs} from "file-saver";
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { DocumentAPI } from '../../../injections';
import {IDocumentAPI} from '@jbpm/domain';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-modif',
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
}
)
export class ModifComponent implements OnInit, OnChanges {
  scriptRessources = [
    "http://localhost:8080/kie-server/services/rest/server/files/patternfly/js/jquery.min.js",
    "http://localhost:8080/kie-server/services/rest/server/files/patternfly/js/patternfly.min.js",
    "http://localhost:8080/kie-server/services/rest/server/files/bootstrap/js/bootstrap-slider.js",
    "http://localhost:8080/kie-server/services/rest/server/files/bootstrap/js/bootstrap-tagsinput.js",
    "http://localhost:8080/kie-server/services/rest/server/files/js/forms.js",
    "http://localhost:8080/kie-server/services/rest/server/files/js/kieserver-ui.js"
  ]
  constructor(
    private renderer: Renderer2,
    private safeHtml: SafeHtmlPipe,
    @Inject(DocumentAPI) public documentAPI: IDocumentAPI,
    private scriptService: ScriptService
  ) {

  }

  @ViewChild('modalForm') modalForm: ElementRef | undefined;
  @Input() form = ''
  @Input() taskStatus = TasKStatus.Unknow
  TaskStatus =TasKStatus
  defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!)
  @Input() requestDetail: any = {
    "task-id": -2,
    "task-name": "",
    "task-subject": "",
    "task-description": "",
    "task-status": "Unknow",
    "task-priority": -2,
    "task-is-skipable": false,
    "task-actual-owner": "",
    "task-created-by": undefined,
    "task-created-on": {
      "java.util.Date": 1731777579091
    },
    "task-activation-time": {
      "java.util.Date": 1731777579091
    },
    "task-expiration-time": undefined,
    "task-proc-inst-id": -2,
    "task-proc-def-id": "",
    "task-container-id": "",
    "task-parent-id": -2,
    "correlation-key": "",
    "process-type": -2
  };
  @Input() currentUserTaskInfos: { [key: string]: { [key: string]: any } } = {}
  @Output() modalShowChange = new EventEmitter<Boolean>();
  @Output() onCompleteTask = new EventEmitter();
  @Input() closeModal = true
  faCircleCheck: any;
  priority = ''

  ngOnInit() {
    this.priority = this.getPriority(this.requestDetail['task-priority'])
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.loadForm()
  }

  loadForm(){
    let modalFormNode = this.modalForm?.nativeElement as HTMLElement
    while ((modalFormNode)?.firstChild) {
      modalFormNode.removeChild(modalFormNode.lastChild!);
    }
    modalFormNode?.insertAdjacentHTML('beforeend', this.form);

    if(modalFormNode){
      this.loadFormScript(modalFormNode)
    }
  }

  loadFormScript(modalFormNode: HTMLElement){
    let dynamicScriptRessources: HTMLScriptElement[] = Object.values(modalFormNode.children).filter(child => child instanceof HTMLScriptElement) as any as HTMLScriptElement[]

    const jqueryElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[0]);
    jqueryElement!.onload = () => {
      const patternElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[1]);
      patternElement!.onload = () => {
        const sliderElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[2]);
        sliderElement!.onload = () => {
          const tagsElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[3]);
          tagsElement!.onload = () => {
            const formsElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[4]);
            formsElement!.onload = () => {
              const kieServerElement = this.scriptService.loadJsScript(this.renderer, this.scriptRessources[5]);
              kieServerElement!.onload = () => {
              }
            }
          }
          //////
          dynamicScriptRessources.forEach((ressource:HTMLScriptElement) =>{
           const scriptElement = this.scriptService.loadJsScript(this.renderer, ressource, true);
               scriptElement!.onload = () => {
          }
          scriptElement!.onerror = (e) => {
          }
          })
          setTimeout(() => {
            const ajaxInterceptorScript = this.scriptService.loadJsScript(this.renderer, this.addAjaxAuthorisationHeaderInterceptorScript());
            ajaxInterceptorScript!.onload = () => {
            }
          }, 2000)
        }
        //
      }
      //

    }
  }

  // simpleCall(ressource: HTMLScriptElement| string){
  //                const scriptElement = this.scriptService.loadJsScript(this.renderer, ressource);
  //                scriptElement!.onload = () => {
  //                 return
  //           }
  // }
  // sequencialLoad(element: HTMLScriptElement, f: Function ){
  //        element!.onload = () => {
  //         f();
  //   }
  // }
  async getDocumentDetail(documentName: string, documentContent: string){
    let getGoodDoc = false
    let currentPage= 0
    let numberOfDoc = 10
    let paginationLimit = 5
    let documents = this.documentAPI.listAllDocuments(0,5, this.defaultHeader)
    let doc: DocumentInstanceType|undefined
    try{
      while(!getGoodDoc && currentPage<paginationLimit){
        let documents: DocumentInstancesType = await this.documentAPI.listAllDocuments(currentPage, numberOfDoc, this.defaultHeader)
        doc = documents['document-instances'].find(doc => {
          return doc['document-name'] === documentName})
        if(doc){
          getGoodDoc = true
        }
        currentPage++
      }
      return doc
    }
    catch(e){
      return null
    }
  }
  onclose() {
    this.closeModal = true
    this.modalShowChange.emit(this.closeModal)
  }

  setCloseModal(e: Event) {
    this.onclose()
  }

  @HostListener('click', ['$event.target']) 
  async onClick(e: any) {
      let streamHeader = Object.assign({},this.defaultHeader,{
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/octet-stream'
      })
    if (['txt','pdf','docx','jpeg', 'jpg', 'png'].some(val => val === (e as HTMLElement)?.innerText?.split('.')[1])) {
      let doc = await this.getDocumentDetail(
        (e as HTMLElement).innerText, (e as HTMLElement).attributes[3].value
      )
      let docDetail = await this.documentAPI.displayDocumentById(doc!['document-id'],  this.defaultHeader)
      let docContent = await this.documentAPI.displayDocumentContentById(doc!['document-id'],  streamHeader)
      let url = window.URL.createObjectURL(new Blob([docContent],{type: 'application/octet-stream'}));
      let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = (e as HTMLElement).innerText;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      // saveAs(docDetail)
    }
    //data-field="document"
    if (e.toString().includes('<a data-field="document"')) {
    }
  }

  parseXml(xmlStr: string) {
    if (window.DOMParser) {
      return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
    } else {
      return null;
    }
  }

  scale: number = 1;
  isMaximized = false;
  isDocumentsExpanded = true;
  isDetailsExpanded = true;
  isHistoryExpanded = true;

  setScale(e: any) {
    this.scale = e
  }

  setMaximized(e: any) {
    this.isMaximized = e
  }

  completeTask() {
    this.onCompleteTask.emit({
      taskId: this.requestDetail['task-id'],
      containerId: this.requestDetail['task-container-id']
    })
  }

  getPriority(priority: number) {
    const priorities = [
      'LOW',
      'MEDIUM',
      'HIGH',
    ];
    return priorities[priority] || priorities[0];
  }

  addAjaxAuthorisationHeaderInterceptorScript() {
    let ajaxBeforeEndStr = `
    $.ajaxSetup({
      beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', JSON.parse(sessionStorage.getItem('defaultHeader'))['Authorization']);
          xhr.setRequestHeader("Content-Type","application/json");
          xhr.setRequestHeader("Accept","application/json");
      }
    });
  `
    return ajaxBeforeEndStr
  }
}


