import { DialogService } from './../../../core/service/dialog/dialog.service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-dialog-wrapper',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    CommonModule,
  ],
  templateUrl: './dialog-wrapper.component.html',
  styleUrl: './dialog-wrapper.component.scss',
})
export class DialogWrapperComponent {
  @ViewChild(NgComponentOutlet, { static: false })
  ngComponentOutlet!: NgComponentOutlet;

  constructor(
    public dialogRef: MatDialogRef<DialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogService
  ) { }

  submit(): void {
    this.dialogService.emit({ eventType: 'submit', data: {} });
    this.dialogRef.close();
  }
}
