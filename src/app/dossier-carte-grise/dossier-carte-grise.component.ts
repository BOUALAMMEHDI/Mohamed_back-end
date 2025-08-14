import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationService } from '../services/operation.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dossier-carte-grise',
  templateUrl: './dossier-carte-grise.component.html',
  styleUrls: ['./dossier-carte-grise.component.css']
})
export class DossierCarteGriseComponent {
  constructor(private http: HttpClient,private operationService: OperationService) {}

  centre: string = '';
  selectedProvince: string = '';
  showNImmatriculation: boolean = false;
  showRemorque: boolean = false;
  selectedImmatriculation: string = '';
  immatriculationInput: string = '';
  remorqueInput1: string = '';
  remorqueInput2: string = '';
  immatriculation: string = '';
  dateDepot: string = '';
  sousOperation: string = '';
  reference: string = '';
  additionalInput1: any;
  input3: any;
  nInput1: any;
  hiddenInput: any;
  nInput3: any;
  f1Inputs:any;
  fichier1: any;
  palais: any;
  credit: any;
  organismeCredit: any;
  selectedOperation: string = '';
  selectedOperation_Immatriculation_remoreque: string = '';
  entites2 = ['Palais', 'DST'];
  selectedF1Input: string = ''; 
  fichier2: boolean = false;
  fichier3: boolean = false;
  fichier4: boolean = false; 
operations= ['Palais', 'DST'];
Ndossier_1:string = '';
Ndossier_2:string = '';
dropdownValue_entitiee: number | null = null; 
isInput1MaxDigits: boolean = false; 
isInput2Valid: boolean = true;
showLotInputs = false;
message: string = '';
private apiUrl = 'https://localhost:7284/api';
entites :any= [];
typeOperations: any[] = []; 
natureOperations: any[] = [];


loadEntites(): void {
  this.operationService.getEntites().subscribe(
    (data) => {
      this.entites = data; 
    },
    (error) => {
      console.error('Error fetching entites:', error);
    }
  );
}
loadTypeOperations(): void {
  this.operationService.getTypeOperations().subscribe({
    next: (data) => {
      this.typeOperations = data;
    },
    error: (err) => {
      console.error('Error fetching type operations', err);
    }
  });
}

getTestMessage() {
  this.operationService.getTestMessage().subscribe(
    (response) => {
      this.message = response.message;
      Swal.fire({
        title: '',
        text: 'Message from back-end '+  this.message ,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
onOperationChange_type(typeOperationId: string): void {
  this.selectedOperation = typeOperationId;
  console.log(  this.selectedOperation );
  this.operationService.setSelectedOperation(typeOperationId);
  if (!typeOperationId) {
    this.natureOperations = []; 
    return;
  }


  this.operationService.getNatureOperations(typeOperationId).subscribe({
    next: (data) => {
      this.natureOperations = data;  
    },
    error: (err) => {
      console.error('Error fetching nature operations', err);  
    }
  });
}


ngOnInit() {
  this.selectedOperation_Immatriculation_remoreque = 'nImmatriculation';
  this.loadEntites(); 
  this.loadTypeOperations();

}
validateInput_1() {
  this.isInput1MaxDigits = /^\d{1,5}$/.test(this.nInput1);

}
validateInput_2() {
  this.isInput2Valid = /^\d{1,2}$/.test(this.input3);

}
validateInput_1_remorque() {
  this.isInput1MaxDigits = /^\d{1,5}$/.test(this.remorqueInput1);

}
validateInput_2_remorque() {
  this.isInput2Valid = /^\d{1,2}$/.test(this.remorqueInput2);

}
  onRadioChange(checkbox: string): void {
    if (checkbox === 'nImmatriculation') {
      this.selectedOperation_Immatriculation_remoreque = 'nImmatriculation';

      this.showNImmatriculation = !this.showNImmatriculation;
      if (!this.showNImmatriculation) {
        this.showRemorque = false;
      }
    } else if (checkbox === 'remorque') {
      this.showRemorque = !this.showRemorque;
      this.selectedOperation_Immatriculation_remoreque = 'remorque';

    }
  }


  showAcheteurButton(): boolean {
    return this.selectedOperation === 'Mutation';
  }

  showDossierProprietaireButtons(): boolean {
    return ['Immatriculation', 'Remmatriculation', 'Mutation', 'Duplicata'].includes(this.selectedOperation);
  }
  onSubmit(): void {
    console.log('Form submitted with the following data:', {
      selectedOperation: this.selectedOperation,
      centre: this.centre,
      selectedProvince: this.selectedProvince,
      showNImmatriculation: this.showNImmatriculation,
      showRemorque: this.showRemorque,
      selectedImmatriculation: this.selectedImmatriculation,
      immatriculationInput: this.immatriculationInput,
      remorqueInput1: this.remorqueInput1,
      remorqueInput2: this.remorqueInput2,
      selectedEntite: this.selectedEntite,
      immatriculation: this.immatriculation,
      dateDepot: this.dateDepot,
      sousOperation: this.sousOperation,
      reference: this.reference
    });
  }


  selectedValue: string | null = null;
  selectedRowIndex: number | null = null;

  onOperationChange(operation: string) {
      
    this.selectedOperation = operation;
    this.operationService.setSelectedOperation(operation);
  }
  reservations: any[] = [];


  
  selectedEntite: number | null = null;

  onEntiteChange() {
    if (this.selectedEntite) {
      this.fetchReservationDetails(this.selectedEntite)
        .then((response) => {
          this.reservations = response;
          this.showReservationPopup(response);
        })
        .catch((error) => {
          this.showErrorPopup(
            error?.error?.Message || 'Failed to fetch reservation details.'
          );
        });
    } else {
      console.log('No entity selected.');
    }
  }
  
  private fetchReservationDetails(entiteId: number): Promise<any[]> {
    return this.http
      .get<any[]>(`https://localhost:7284/api/get-reservation-details?entiteId=${entiteId}`)
      .toPromise()
      .then((data) => data || []) 
      .catch((error) => {
        console.error('Error fetching reservation details:', error);
        return []; 
      });
  }
  
  private showReservationPopup(reservations: any[]) {
    if (!reservations || reservations.length === 0) {
      this.showErrorPopup('No reservations found.');
      return;
    }
  
    const tableHtml = this.buildReservationTableHTML(reservations);
  
    Swal.fire({
      title: 'Reservation Details',
      html: tableHtml,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedRow = document.querySelector(
          '.swal2-popup table tbody tr.selected'
        );
        if (selectedRow) {
          const selectedImmat = selectedRow.getAttribute('data-immat');
          if (selectedImmat) {
            this.performActionWithImmat(selectedImmat);
          }
        }
      }
    });
  
    this.addTableRowClickEvent();
  }
  private buildReservationTableHTML(reservations: any[]): string {
    const rows = reservations
      .map((res, index) => {
        const immat1Values = res.immat1 ? res.immat1.split(',') : [];
        const immat2Value = res.immat2 || '-'; 
        const immat3Value = res.immat3 || '-'; 
  
        return immat1Values
          .map((immat1Value: string) => `
            <tr data-index="${index}" data-immat="${immat1Value}" style="cursor: pointer;">
              <td style="border: 1px solid #ddd; padding: 8px;">${immat1Value.trim()}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${immat2Value.trim()}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${immat3Value.trim()}</td>
            </tr>
          `)
          .join(''); 
      })
      .join(''); 
  
    return `
      <div style="max-height: 200px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Immat1</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Immat2</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Immat3</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }
  
  
  private addTableRowClickEvent() {
    const tableRows = document.querySelectorAll('.swal2-popup table tbody tr');
  
    tableRows.forEach((row) => {
      row.addEventListener('click', () => {
        tableRows.forEach((r) => {
          r.classList.remove('selected');
          (r as HTMLElement).style.backgroundColor = '';
        });
  
        row.classList.add('selected');
        (row as HTMLElement).style.backgroundColor = '#f0f8ff';
      });
    });
  }
  
  private showErrorPopup(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
    });
  }
  
    private performActionWithImmat(immat: string) {
      console.log('Selected Immatriculation:', immat);
  
      const selectedReservation = this.reservations.find(res => res.immat1 === immat);  
      
      if (selectedReservation) {
        this.nInput1 = selectedReservation.immat1; 
        this.f1Inputs = selectedReservation.immat3 || ''; 
        this.input3 = selectedReservation.immat2 || ''; 
  
        this.validateInput_1();
      }
      this.validateInput_1();
    }
  
 

  selectEntity(value: string, index: number) {
    this.selectedValue = value; 

    const rows = document.querySelectorAll('#swal-list tr');
    rows.forEach(row => {
      const htmlRow = row as HTMLElement; 
      htmlRow.style.backgroundColor = ''; 
      htmlRow.style.color = '';
    });

    const selectedRow = document.getElementById('row-' + index) as HTMLElement; 
    if (selectedRow) {
      selectedRow.style.color = 'red'; 
    }
}
openDocumentRequiredDialog() {
  Swal.fire({
    title: 'Documents introuvables',
    html: `
      <div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="fichier1" />
          <label class="form-check-label" for="fichier1">Fichier 1</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="fichier2" />
          <label class="form-check-label" for="fichier2">Fichier 2</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="fichier3" />
          <label class="form-check-label" for="fichier3">Fichier 3</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="fichier4" />
          <label class="form-check-label" for="fichier4">Fichier 4</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="credit" />
          <label class="form-check-label" for="credit">Crédit</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="organismeCredit" />
          <label class="form-check-label" for="organismeCredit">Organisme de Crédit</label>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Soumettre',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      this.fichier1 = (document.getElementById('fichier1') as HTMLInputElement).checked;
      this.fichier2 = (document.getElementById('fichier2') as HTMLInputElement).checked;
      this.fichier3 = (document.getElementById('fichier3') as HTMLInputElement).checked;
      this.fichier4 = (document.getElementById('fichier4') as HTMLInputElement).checked;
      this.credit = (document.getElementById('credit') as HTMLInputElement).checked;
      this.organismeCredit = (document.getElementById('organismeCredit') as HTMLInputElement).checked;

      // Optional: Return data if needed
      return {
        fichier1: this.fichier1,
        fichier2: this.fichier2,
        fichier3: this.fichier3,
        fichier4: this.fichier4,
        credit: this.credit,
        organismeCredit: this.organismeCredit,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Handle the confirmed result here, e.g., submit the data or display a message
      Swal.fire('Données soumises', '', 'success');
    }
  });
}
}
