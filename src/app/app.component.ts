import { Component } from '@angular/core';
import { OperationService } from './services/operation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedOperation: string = '';  // Initialize to avoid undefined errors

  constructor(private operationService: OperationService) {}

  title = 'Palais';
  currentComponent: string = 'dossierCarteGrise'; // Default component

  areButtonsHidden: boolean = false;

  setComponent(component: string) {
      this.currentComponent = component;

      // Hide buttons when 'historique', 'reservation', or 'consultation' is clicked
      if (component === 'historique' || component === 'reservation' || component === 'consultation') {
          this.areButtonsHidden = true;
      } else {
          this.areButtonsHidden = false; // Show buttons for other components
      }
  }
  ngOnInit() {
    this.operationService.selectedOperation$.subscribe(operation => {
      this.selectedOperation = operation;
    });
  }
  showAcheteurButton(): boolean {
    return this.selectedOperation === '2';
  }

  showDossierProprietaireButtons(): boolean {
    // return ['Immatriculation', 'Remmatriculation', 'Mutation', 'Duplicata','Echange'].includes(this.selectedOperation);
    return ['1', '2', '3', '4','E'].includes(this.selectedOperation);

  }
  
  onSubmit() {
    console.log("Form submitted!");
  }}
