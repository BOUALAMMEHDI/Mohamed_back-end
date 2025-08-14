import { Component } from '@angular/core';

@Component({
  selector: 'app-proprietaire',
  templateUrl: './proprietaire.component.html',
  styleUrls: ['./proprietaire.component.css']
})
export class ProprietaireComponent {
  isPhysique: boolean = false;
  isMorale: boolean = false;
  f1Inputs: { immatricule_1: string, immatricule_2: string, immatricule_3: string }[] = [];
  isInput1MaxDigits: boolean = false; // Track if input1 has reached exactly 6 digits
  isInput2Valid: boolean = true;
  showLotInputs = false;
  nInput1: any;
  input3: any;
  showExtraInputs_ismorale: boolean = false; // This controls the visibility of the extra inputs
  showExtraInputs_isphysique: boolean = false; // This controls the visibility of the extra inputs

  validateInput_1() {
    // Allow input1 to have between 1 to 6 digits
    this.isInput1MaxDigits = /^\d{1,5}$/.test(this.nInput1);
  
  }
  validateInput_2() {
    // Allow input1 to have between 1 to 6 digits
    this.isInput2Valid = /^\d{1,2}$/.test(this.input3);
  
  }
  onCheckboxChange(type: string): void {
    if (type === 'morale') {
      this.isPhysique = false; // Uncheck "Personne Physique" if "Personne Morale" is selected
    } else if (type === 'physique') {
      this.isMorale = false; // Uncheck "Personne Morale" if "Personne Physique" is selected
    }
  }
}
