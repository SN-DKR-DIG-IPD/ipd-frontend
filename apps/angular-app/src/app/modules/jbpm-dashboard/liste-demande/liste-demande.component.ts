import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule,  } from '@angular/material/dialog';
import {Router, RouterLink} from "@angular/router";
import { NewRequestComponent } from '../new-request/new-request.component';

@Component({
  selector: 'app-liste-demande',
  templateUrl: './liste-demande.component.html',
  styleUrl: './liste-demande.component.scss'
})
export class ListeDemandeComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {

  }

  navigate() {
    this.dialog.open(NewRequestComponent,{
    })
  }





}
