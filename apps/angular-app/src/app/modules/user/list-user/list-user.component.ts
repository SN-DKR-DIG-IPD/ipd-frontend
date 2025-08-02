import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-user',
  template: '<div class="p-4"><h2>Liste des utilisateurs</h2><p>Module temporairement désactivé</p></div>'
})
export class ListUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('ListUserComponent initialisé');
  }
} 