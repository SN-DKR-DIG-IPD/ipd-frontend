import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { TaskInstanceType } from '@jbpm/domain';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

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
  @Input() currentUserTaskInfos: {[key: string]: {[key:string]: any}} = {}
  @Output() modalShowChange = new EventEmitter<Boolean>();
  @Output() onCompleteTask = new EventEmitter();
  @Input() closeModal = true
  faCircleCheck: any;
  priority = ''

  ngOnInit(){
    this.priority = this.getPriority(this.requestDetail['task-priority'])
  }
  onclose () {
    this.closeModal = true
    this.modalShowChange.emit(this.closeModal)
  }

  setCloseModal(e: Event){
    this.onclose()
  }

  parseXml(xmlStr: string){
    if (window.DOMParser) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
} else {
   return null;
}
  }
  scale: number = 1;
  isMaximized = false;
  isDocumentsExpanded = false;
  isDetailsExpanded = false;
  isHistoryExpanded = true;

  setScale(e:any){
    this.scale = e
  }

  setMaximized(e:any){
    this.isMaximized = e
  }

completeTask(){
  this.onCompleteTask.emit({
    taskId: this.requestDetail['task-id'],
    containerId: this.requestDetail['task-container-id']
  })
}

  toggleSection(section: string) {
    switch (section) {
      case 'documents':
        this.isDocumentsExpanded = !this.isDocumentsExpanded;
        break;
      case 'details':
        this.isDetailsExpanded = !this.isDetailsExpanded;
        break;
      case 'history':
        this.isHistoryExpanded = !this.isHistoryExpanded;
        break;
    }
  }

  getPriority(priority: number){
        const priorities = [
      'LOW',
      'MEDIUM',
      'HIGH',
    ];
    return priorities[priority] || priorities[0];
  }
}


