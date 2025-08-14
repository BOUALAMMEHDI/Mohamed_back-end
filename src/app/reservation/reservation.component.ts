import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OperationService } from '../services/operation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  generatedListImmat1: string[] = [];  // Initialize as an empty array
  constructor(private http: HttpClient, private operationService: OperationService) { }

  isNImmatriculation = false;
  isMatriculeRemorque = false;
  showLotInputs = false;
  input1: string = '';
  input1_remorque: string = '';

  dropdownValue: string = '';
  input2: string = '';
  input3: number | null = null;
  input3_remorque: string = '';

  input4: number | null = null;
  generatedList: {
    input3: number;
    input2: string;
    dropdown: string;
    entite: number;  // required
    consommer: number;  // required
    errorMessage?: string;
    hasError?: boolean;
    hasDuplicate?: boolean;
    style?: { [key: string]: string };
  }[] = [];




  entiteValue: any;
  dropdownValue_entitiee: string = '';
  isInput1MaxDigits: boolean = false;
  isInput2Valid: boolean = true;
  selectedOperation = false;
  entites: {
    idEntite: any; IdEntite: number, libelle: string
  }[] = [];
  selectedValue: number | undefined;


  loadEntites(): void {
    this.operationService.getEntites().subscribe(
      (data) => {
        this.entites = data;
        console.log('Fetched Entites:', data);


        if (this.entites.length > 0) {
          this.selectedValue = this.entites[0].idEntite;
        }
      },
      (error) => {
        console.error('Error fetching entites:', error);
      }
    );
  }

  onDropdownChange(event: any): void {
    console.log('Selected value:', event.target.value);
    console.log('selectedValue:', this.selectedValue);
    // const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    // this.selectedValue = selectedIndex;  
  }
  ngOnInit(): void {
    this.loadEntites();

  }
  validateInput_1() {
    this.isInput1MaxDigits = /^\d{1,5}$/.test(this.input1);

  }
  validateInput_2() {
    this.isInput2Valid = /^\d{1,2}$/.test(this.input2);

  }

  validateInput_1_remorque() {
    this.isInput1MaxDigits = /^\d{1,5}$/.test(this.input1_remorque);

  }
  validateInput_3_remorque() {
    this.isInput2Valid = /^\d{1,2}$/.test(String(this.input3_remorque ?? ''));
  }
  resetForm() {
    this.showLotInputs = false;
    this.generatedList = [];
    this.input1 = '';
    this.dropdownValue = '';
    this.input2 = '';
    this.input3 = null;
    this.input4 = null;
  }

  generateList_Immatriculation() {
    if (this.input3 !== null && this.input4 !== null && this.input3 <= this.input4) {
      this.generatedList = [];
      for (let i = this.input3; i <= this.input4; i++) {
        this.generatedList.push({
          input3: i,
          dropdown: this.dropdownValue,
          input2: this.input2,
          entite: this.selectedValue ?? 0,  // Provide a default value if selectedValue is undefined
          consommer: 0
        });
      }
    }
    this.generatedListImmat1 = this.generatedList.map(item => item.input3.toString());
  }

  // generateList_Remorque() {
  //   if (
  //     this.input3 !== null &&
  //     this.input4 !== null &&
  //     this.input3_remorque !== null &&
  //     this.input3 <= this.input4
  //   ) {
  //     this.generatedList = [];
  //     for (let i = this.input3; i <= this.input4; i++) {
  //       this.generatedList.push({
  //         input3: i,
  //         input2: this.input3_remorque.toString(), 
  //         dropdown: this.dropdownValue_entitiee || ''  
  //       });
  //     }
  //   }
  // }
  getImmat1(): string {
    let immat1String: string;

    if (this.showLotInputs && this.generatedListImmat1.length > 0) {
      // Join the list without a trailing comma
      immat1String = this.generatedListImmat1.join(',');

      // Ensure the length of Immat1 does not exceed the backend validation
      if (immat1String.length > 100) {
        immat1String = immat1String.substring(0, 100);  // Truncate to fit the max length (100 chars)
      }
    } else {
      // Handle the case for a single input and ensure it respects the limit
      immat1String = this.input1.substring(0, 100);  // Ensure it doesn't exceed the max length
    }

    return immat1String;
  }



  existingReservations: any[] = []; // This will hold the existing reservations fetched from the backend
  check: boolean = false;
  Reserver() {
    // Reset inputs based on condition
    if (this.isNImmatriculation) {
      this.input1_remorque = '0';
      this.input3_remorque = '0';
    }

    if (this.isMatriculeRemorque) {
      this.input1 = '0';
      this.input2 = '0';
      this.dropdownValue = '0';
    }


    const checkReservationExistence = (reservations: any[]) => {
      this.operationService.checkReservationsExist(reservations).subscribe(
        (response: any) => {
          console.log('Response from backend:', response);
          if (response && response.length > 0) {
            this.existingReservations = response;

            const validReservations: any[] = []; // Holds all valid (non-duplicate) reservations

            // Iterate through the generated list to check each item
            this.generatedList.forEach(item => {
              const input3 = item.input3 ? item.input3.toString().trim() : '';
              const input2 = item.input2 ? item.input2.toString().trim() : '';
              const dropdown = item.dropdown ? item.dropdown.toString().trim() : '';
              const consommer = item.consommer ?? null; // Ensure consommer is treated correctly
              const entite = (item.entite ?? '').toString().trim();  // Ensure entite is treated as a string

              // Check if the current item is a duplicate
              const isDuplicate = this.existingReservations.some(reservation => {
                const reservationEntite = (reservation.entite ?? '').toString().trim  (); // Reservation entity from backend
                const reservationConsommer = reservation.consommer ?? null; // Consommer from backend

                const isSameImmat = reservation.immat1 && reservation.immat2 && reservation.immat3 &&
                  reservation.immat1.toString().trim() === input3 &&
                  reservation.immat2.toString().trim() === input2 &&
                  reservation.immat3.toString().trim() === dropdown;

                if (isSameImmat) {
                  console.log('Comparing entite values:', entite, reservationEntite);
                  console.log('Are they equal?', entite === reservationEntite);
                  console.log('Comparing consommer values:', consommer, reservationConsommer);
                  console.log('Are they equal?', consommer === reservationConsommer);

                  // Case 1: consommer = 0 and same entity: Allow reservation
                  if( entite !== reservationEntite)
                  {
                    item.hasDuplicate = true;  // Mark as duplicate

                    return true;
                  }
                  if (consommer === 0 && entite === reservationEntite) {
                    console.log("Allow reservation: consommer = 0, same entite");
                    item.hasDuplicate = false;  // Mark as duplicate

                    return true;  // Mark as duplicate but allow
                  }

                  // Case 2: consommer = 1 and same entity: Prevent reservation
                  else if (consommer === 1 && entite === reservationEntite) {
                    console.log("Prevent reservation: consommer = 1, same entite");
                    Swal.fire({
                      icon: 'error',
                      title: 'Duplicate Reservation',
                      text: 'This reservation is a duplicate for the same entity.',
                      confirmButtonText: 'OK'
                    });
                    // item.hasDuplicate = true;  // Mark as duplicate
                    return true;  // Prevent reservation
                  }

                  // Case 3: consommer = 0 and different entity: Prevent reservation
                  else if (consommer === 0 && entite !== reservationEntite) {
                    console.log("Prevent reservation: consommer = 0, different entite");
                    Swal.fire({
                      icon: 'error',
                      title: 'Duplicate Reservation',
                      text: 'This reservation is a duplicate for a different entity.',
                      confirmButtonText: 'OK'
                    });
                    item.hasDuplicate = true;  
                    return false;  
                  }
                }

                return false;  
              });

              item.hasDuplicate = isDuplicate;  

              if (!isDuplicate) {
                validReservations.push({
                  Immat1: input3,
                  Immat2: input2,
                  Immat3: dropdown,
                  Immat1Remorque: this.input1_remorque,
                  Immat3Remorque: this.input3_remorque,
                  consommer: consommer,
                  entite: entite
                });
              }
            });
            console.log('Valid Reservations:', validReservations);

            if (validReservations.length > 0) {
              this.addReservations(validReservations);  
            } else {
              console.log('No valid reservations to add.');
              Swal.fire({
                title: 'Déjà réservé / تم الحجز مسبقاً',
                text: 'Cet article a déjà été réservé. / تم حجز هذا العنصر مسبقاً.',
                icon: 'info',
                confirmButtonText: 'OK / موافق'
              });
              
            }
          } else {
            console.log('No existing reservations to check against. Proceeding with adding all reservations.');
            this.addReservations(reservations); 
          }
        },
        (error: any) => {
          console.error('Error checking reservations existence', error);
        }
      );
    };




    // Handle batch reservation mode
    if (this.showLotInputs) {
      const startRange = this.input3 ?? 0;
      const endRange = this.input4 ?? 0;
      const reservationsBatch = [];

      for (let i = startRange; i <= endRange; i++) {
        // Generate reservation data
        const reservation = {
          Entite: this.selectedValue,
          Immat1: i.toString(),
          Immat2: this.input2,
          Immat3: this.dropdownValue,
          Immat1Remorque: this.input1_remorque,
          Immat3Remorque: this.input3_remorque,
          Consommer: 0,
        };
        reservationsBatch.push(reservation);
      }

      // Check if the reservations already exist
      checkReservationExistence(reservationsBatch);

    } else {
      // Handle single reservation mode
      const reservation = {
        Entite: this.selectedValue,
        Immat1: this.getImmat1(),
        Immat2: this.input2,
        Immat3: this.dropdownValue,
        Immat1Remorque: this.input1_remorque,
        Immat3Remorque: this.input3_remorque,
        Consommer: 0,
      };

      // Check if the reservation exists
      checkReservationExistence([reservation]);

    }
  }

  // Helper function to add reservations (Batch or Single)
  addReservations(reservations: any[]) {
    if (this.showLotInputs) {
      // Batch reservation mode
      this.operationService.addReservationsBatch(reservations).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Succès!',
            text: `${reservations.length} réservations ajoutées avec succès!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajout des réservations. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      // Single reservation mode
      this.operationService.addReservation(reservations[0]).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Réservation ajoutée avec succès!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajout de la réservation. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }


  Vider() {
    this.isNImmatriculation = false;
    this.isMatriculeRemorque = false;
    this.input1 = '';
    this.dropdownValue = '';
    this.input2 = '';
    this.showLotInputs = false;
    this.input3 = null;
    this.input4 = null;
    this.generatedList = [];
  }
  onSubmit() {
  }
  searchTerm: string = '';


  filteredList() {
    if (!this.searchTerm) {
      return this.generatedList;
    }

    const term = this.searchTerm.toLowerCase();

    return this.generatedList.filter(item =>
      (item.input3 !== null && item.input3.toString().toLowerCase().includes(term)) ||
      (item.dropdown.toLowerCase().includes(term)) ||
      (item.input2.toLowerCase().includes(term))
    );
  }
}
