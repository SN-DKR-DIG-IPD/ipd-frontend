type FrontDemande = {
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
};

export type { FrontDemande as FrontDemandeType};