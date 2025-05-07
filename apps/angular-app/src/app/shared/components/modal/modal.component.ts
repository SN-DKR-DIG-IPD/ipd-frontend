import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() closeModal = true
  @Output() modalShowChange = new EventEmitter();
  @Output() onScaleChanged = new EventEmitter();
  @Output() onMaximizedChanged = new EventEmitter();
  @Input() scale: number = 1;
  @Input() isMaximized = false;

  handleZoomIn() {
    if (this.scale < 2) this.scale += 0.1;
    this.onScaleChanged.emit(this.scale)
  }

  handleZoomOut() {
    if (this.scale > 0.5) this.scale -= 0.1;
    this.onScaleChanged.emit(this.scale)
  }

  handleReset() {
    this.scale = 1;
    this.onScaleChanged.emit(this.scale)
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    this.scale = 1;
    this.onScaleChanged.emit(this.scale)
    this.onMaximizedChanged.emit(this.isMaximized)
  }

  hideModal(){
    this.closeModal = true;
    this.modalShowChange.emit(this.closeModal);
  }

  showModal(){
    this.closeModal = false;
    this.modalShowChange.emit(this.closeModal);
  }
}
