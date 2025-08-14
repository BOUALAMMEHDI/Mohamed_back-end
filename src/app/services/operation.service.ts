// Importation des modules nécessaires d'Angular pour la gestion des requêtes HTTP
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Le décorateur @Injectable permet à ce service d'être injecté dans d'autres composants ou services
@Injectable({
  providedIn: 'root'  // Le service sera disponible globalement dans l'application
})
export class OperationService {

  // Le constructeur initialise le service HttpClient pour effectuer des requêtes HTTP
  constructor(private http: HttpClient) { }

  // URLs des API Backend
  private apiUrlpalais = 'https://localhost:7284/api'; // URL de l'API pour les opérations principales
  private apiUrlpalais_ref = 'https://localhost:7284/ref'; // URL de l'API pour les références

  // Comportement par défaut pour la gestion d'une opération sélectionnée
  private selectedOperationSource = new BehaviorSubject<string>('');  // Valeur initiale pour BehaviorSubject
  selectedOperation$ = this.selectedOperationSource.asObservable();    // Observable que les composants peuvent souscrire

  // Méthode pour mettre à jour l'opération sélectionnée
  setSelectedOperation(operation: string) {
    this.selectedOperationSource.next(operation);  // Met à jour la valeur de l'opération sélectionnée
  }

  // Méthode pour obtenir un message de test du backend
  getTestMessage(): Observable<any> {
    return this.http.get<any>(this.apiUrlpalais);  // Envoie une requête GET au backend pour récupérer un message
  }

  // Méthode pour ajouter une nouvelle réservation
  addReservation(reservation: any): Observable<any> {
    // Envoie une requête POST au backend pour ajouter une réservation
    return this.http.post<any>(`${this.apiUrlpalais}/Reservation`, reservation);
  }

  // Méthode pour récupérer la liste des entités depuis l'API
  getEntites(): Observable<any[]> {
    // Envoie une requête GET pour obtenir la liste des entités
    return this.http.get<any[]>(`${this.apiUrlpalais_ref}/entites`);
  }

  // Méthode pour récupérer les détails des réservations d'une entité donnée
  getReservationDetails(entiteId: number): Observable<any[]> {
    // Envoie une requête GET pour obtenir les détails de réservation pour une entité spécifique
    return this.http.get<any[]>(`${this.apiUrlpalais}/get-reservation-details?entiteId=${entiteId}`);
  }

  // Méthode pour ajouter un lot de réservations
  addReservationsBatch(reservations: any[]): Observable<any> {
    // Envoie une requête POST pour ajouter plusieurs réservations à la fois
    return this.http.post(`${this.apiUrlpalais}/AddReservationsBatch`, reservations);
  }

  // Méthode pour vérifier si certaines réservations existent déjà dans le système
  checkReservationsExist(reservations: any[]): Observable<any> {
    // Envoie une requête POST pour vérifier si certaines réservations existent déjà
    return this.http.post<any>(`${this.apiUrlpalais}/CheckReservationsExist`, reservations);
  }

  // Méthode pour récupérer les types d'opérations depuis l'API
  getTypeOperations(): Observable<any[]> {
    // Envoie une requête GET pour obtenir les types d'opérations disponibles
    return this.http.get<any[]>(`${this.apiUrlpalais_ref}/typeoperations`);
  }

  // Méthode pour récupérer les natureOperations (types spécifiques d'opération) en fonction de l'ID d'un type d'opération
  getNatureOperations(typeOperationId: string): Observable<any[]> {
    // Envoie une requête GET pour obtenir les natures d'opérations d'un type spécifique
    const url = `https://localhost:7284/ref/natureoperations/${typeOperationId}`;
    return this.http.get<any[]>(url);
  }

  // Méthode pour récupérer les carburants disponibles depuis l'API
  getCarburants(): Observable<any[]> {
    // Envoie une requête GET pour obtenir la liste des carburants disponibles
    return this.http.get<any[]>(`${this.apiUrlpalais_ref}/carburants`);
  }
  
 // Get all Type Usages
 getTypeUsages(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrlpalais_ref}/typeusages`);
}

// Get Usages by Type Usage
getUsagesByType(typeusageId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrlpalais_ref}/Usage/${typeusageId}`);
}
saveData(Type: string, Value: string): Observable<any> {
  const data = { Type, Value };
  return this.http.post<any>(`${this.apiUrlpalais}/save`, data);
}
  // Method to get usage types
  getUsage(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlpalais_ref}/getAllUsages`);
  }
  
  GetAllGentreData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlpalais_ref}/GetAllGentreData`);
  }
   // Method to save a new usage
   addUsage(usage:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlpalais}/addUsage`, usage);
  }
  deleteCarburant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlpalais}/DeleteCarburant/${id}`);
  }
  updateCarburant(carburant: { id_carburant: number; libelle: string }): Observable<any> {
    return this.http.put(`${this.apiUrlpalais}/UpdateCarburant/${carburant.id_carburant}`, carburant);
  }
  deleteTypeUsage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlpalais}/DeleteTypeUsage/${id}`);
  }
  updateTypeUsage(typeusage: { TyUsCode: number; TyUsLibe: string }): Observable<any> {
    return this.http.put(`${this.apiUrlpalais}/UpdateTypeUsage/${typeusage.TyUsCode}`, typeusage);
  }
  deleteUsage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlpalais}/DeleteUsage/${id}`);
  }
  updateUsage(usage: { CodeUsag: number; LibeUsag: string,TyUsCode:number}): Observable<any> {
    return this.http.put(`${this.apiUrlpalais}/UpdateUsage/${usage.CodeUsag}`, usage);
  }

}