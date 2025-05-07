import { Injectable } from "@angular/core";

export interface Demande {
    numero: number;
    type: string;
    sujet: string;
    statut: string;
    dateDebut: string;
    dateFin: string;
    Responsable: string;
    priorite: string;
    approbateur: string;
    tauxDachevement: number;
}


@Injectable({
    providedIn: 'root'
})
export class DemandeService {

    demandes: Demande[] = [
        {
          numero: 1, 
          type: 'Financial commitments' ,
          sujet: 'Purchase order for office supplies', 
          statut: 'In Progress', 
          dateDebut: '2024-02-05', 
          dateFin: '2024-02-05', 
          Responsable: 'Ousseynou Thiaw', 
          priorite: 'High', 
          approbateur: 'EDDY', 
          tauxDachevement: 90,
    
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
              approbateur: 'EDDY',
              tauxDachevement: 90,
          },
          {
              numero: 3,
              type: 'Human Resources',
              sujet: 'Employee contract renewal',
              statut: 'Pending',
              dateDebut: '2024-01-15',
              dateFin: '2024-01-20',
              Responsable: 'Moussa Ndiaye',
              priorite: 'Medium',
              approbateur: 'SOPHIE',
              tauxDachevement: 100,
          },
          {
              numero: 4,
              type: 'Marketing',
              sujet: 'Social media campaign launch',
              statut: 'Approved',
              dateDebut: '2024-03-10',
              dateFin: '2024-03-20',
              Responsable: 'Fatou Diop',
              priorite: 'Low',
              approbateur: 'PAUL',
              tauxDachevement: 0,
          },
          {
              numero: 5,
              type: 'IT',
              sujet: 'Server upgrade request',
              statut: 'Approved',
              dateDebut: '2024-02-10',
              dateFin: '2024-02-15',
              Responsable: 'Amadou Sarr',
              priorite: 'High',
              approbateur: 'JULIE',
              tauxDachevement: 70,
          },
          {
              numero: 6,
              type: 'Logistics',
              sujet: 'Vehicle maintenance schedule',
              statut: 'Approved',
              dateDebut: '2024-04-01',
              dateFin: '2024-04-07',
              Responsable: 'Awa Gueye',
              priorite: 'Medium',
              approbateur: 'THOMAS',
              tauxDachevement: 50,
          },
          {
              numero: 7,
              type: 'Operations',
              sujet: 'Warehouse inventory audit',
              statut: 'Approved',
              dateDebut: '2024-01-05',
              dateFin: '2024-01-10',
              Responsable: 'Ibrahima Fall',
              priorite: 'High',
              approbateur: 'CATHERINE',
              tauxDachevement: 100,
          },
          {
              numero: 8,
              type: 'Financial commitments',
              sujet: 'Budget allocation for Q1',
              statut: 'Approved',
              dateDebut: '2024-02-28',
              dateFin: '2024-03-01',
              Responsable: 'Khadim Bâ',
              priorite: 'High',
              approbateur: 'EDDY',
              tauxDachevement: 0,
          },
          {
              numero: 9,
              type: 'Legal',
              sujet: 'Contract review for new vendor',
              statut: 'Approved',
              dateDebut: '2024-02-18',
              dateFin: '2024-02-22',
              Responsable: 'Marième Seck',
              priorite: 'Medium',
              approbateur: 'FREDERIC',
              tauxDachevement: 60,
          },
          {
            numero: 10,
            type: 'Legal',
            sujet: 'Contract review for new vendor',
            statut: 'Approved',
            dateDebut: '2024-02-18',
            dateFin: '2024-02-22',
            Responsable: 'Marième Seck',
            priorite: 'Medium',
            approbateur: 'FREDERIC',
            tauxDachevement: 60,
        },
        {
            numero: 11,
            type: 'Legal',
            sujet: 'Contract review for new vendor',
            statut: 'Approved',
            dateDebut: '2024-02-18',
            dateFin: '2024-02-22',
            Responsable: 'Marième Seck',
            priorite: 'Medium',
            approbateur: 'FREDERIC',
            tauxDachevement: 60,
        },
        {
            numero: 12,
            type: 'Legal',
            sujet: 'Contract review for new vendor',
            statut: 'Approved',
            dateDebut: '2024-02-18',
            dateFin: '2024-02-22',
            Responsable: 'Marième Seck',
            priorite: 'Medium',
            approbateur: 'FREDERIC',
            tauxDachevement: 60,
        },
        {
            numero: 13,
            type: 'Legal',
            sujet: 'Contract review for new vendor',
            statut: 'Approved',
            dateDebut: '2024-02-18',
            dateFin: '2024-02-22',
            Responsable: 'Marième Seck',
            priorite: 'Medium',
            approbateur: 'FREDERIC',
            tauxDachevement: 60,
        }
    ];
    
    constructor() {}

    getDemandes() {
        return this.demandes;
    }
    
    getDemandeById(nemero: number) : Demande | undefined {
        return this.demandes.find(demande => demande.numero === nemero);
    }
  
}
  