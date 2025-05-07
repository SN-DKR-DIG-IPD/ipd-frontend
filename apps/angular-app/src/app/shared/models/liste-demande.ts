import { Injectable } from "@angular/core";
import { Demande } from "./Demande";

@Injectable({
    providedIn: 'root'
})
export class ListeDemandeService {
  constructor() {}
  listeDemande: Demande[] = [
    {
        numero: 1,
        type: 'Financial commitments',
        sujet: 'Purchase order for office supplies',
        statut: 'In Progress',
        dateDebut: '2024-02-05',
        dateFin: '2024-02-05',
        Responsable: 'Ousseynou Thiaw',
        priorite: 'High',
        approbateur: "",
        tauxDachevement: 0,
        
    },
    {
        numero: 2,
        type: 'Financial commitments',
        sujet: 'Purchase order for office supplies',
        statut: 'In Progress',
        dateDebut: '2024-02-05',
        dateFin: '2024-02-05',
        Responsable: 'Ousseynou Thiaw',
        priorite: 'High',
        approbateur: "",
        tauxDachevement: 0,

    },
    {
        numero: 2,
        type: 'Financial commitments',
        sujet: 'Purchase order for office supplies',
        statut: 'In Progress',
        dateDebut: '2024-02-05',
        dateFin: '2024-02-05',
        Responsable: 'Ousseynou Thiaw',
        priorite: 'High',
        approbateur: "",
        tauxDachevement: 0,
    }
  ];

  getListeDemande() {
    return this.listeDemande;
  }
}