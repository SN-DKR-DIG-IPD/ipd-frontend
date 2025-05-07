import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProcessType } from '@jbpm/domain';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss'
})
export class NewRequestComponent implements OnChanges{


  [x: string]: any;
  @Input() demande: ProcessType|undefined;
  @Output() close = new EventEmitter<void>();
  @Output() onStartNewProcess = new EventEmitter();

  processName = ''
  processVersion = ''

  ngOnChanges(changes: SimpleChanges): void {
    this.processName = this.demande?.['process-name']!
    this.processVersion = this.demande?.['process-version']!
  }

  onclose()  {
    this.close.emit();
  }

  get Math () {
    return Math
  }

  formState = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    textarea:'',
    profilePic: null
  };

  isDragging = false;
  isSubmitting = false;
  isSubmitted = false;
  currentSection = 0;


  startProcess(){
    this.onStartNewProcess.emit(this.demande)
  }

  exitProcess(){
  }

  goToNextSection() {
    this.currentSection += 1;
  }

  goToPreviousSection() {
    this.currentSection -= 1;
  }

  setDragging(value: boolean) {
    this.isDragging = value;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
    }
  }

}
