import { Component } from '@angular/core';
import { Vehicle } from '../Models/historique.model';
import { HttpClient } from '@angular/common/http';
import { OperationService } from '../services/operation.service';

import { FormsModule } from '@angular/forms';  // Import FormsModule
// Import PrimeNG modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for animations in PrimeNG


interface Genre {
  code: string;
  libelle: string;
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {
  constructor(private http: HttpClient,private operationService: OperationService) {}


    carburants: any[] = []; // Array to store the list of carburants
    Usages: any[] = []; // Array to store the list of carburants
    selectedOperation: number | undefined;
    Typeusages : any[] = []; // Holds the available types of usage
    selectedtype:number | undefined;
    genre: Genre[] = []; // Updated to an array of Genre objects
    selectedgenre: Genre | undefined; // Updated to match the structure of the genre objects    
    vehicle: Vehicle = new Vehicle();  // Create an instance of the Vehicle model
  
  ngOnInit() {
      this.fetchCarburants(); 
      this.loadTypeUsages();
      this.loadTGenre();
    
    
    }
  // Function to handle form submission
    onSubmit() {
      console.log(this.vehicle);  // Log the vehicle object to console
      // Here you can perform further actions like sending data to backend, etc.
    }
    // Method to fetch carburants using the service
    fetchCarburants(): void {
      this.operationService.getCarburants().subscribe(
        (data) => {
          this.carburants = data; // Store the carburants in the array
        },
        (error) => {
          console.error('Error fetching carburants:', error);
        }
      );
    }

    // Fetch Type Usage data from the service
  loadTypeUsages() {
    this.operationService.getTypeUsages().subscribe(data => {
      this.Typeusages = data;
      console.log('Type Usages:', this.Typeusages); // Check if the data is loaded correctly
    }, error => {
      console.error('Error loading Type Usages:', error);
    });
  }
  loadTGenre(): void {
    this.operationService.GetAllGentreData().subscribe(
      (data: any) => {
        this.genre = data.map((item: any) => ({
          name: item.name,
          code: item.code,
          libelle: item.libelle
        })); // Ensure the structure matches the Genre interface
      },
      (error: any) => {
        console.error('Error fetching genres:', error);
      }
    );
  }

  onTypeUsageChange() {
    const selectedTypeUsage = parseInt(this.vehicle.typeUsage, 10); // Convert to number using `parseInt()`
  
    if (selectedTypeUsage) {
      this.operationService.getUsagesByType(selectedTypeUsage).subscribe(data => {
        this.Usages = data;
        console.log('Usages:', this.Usages);
      }, error => {
        console.error('Error loading Usages:', error);
        this.Usages = [];
      });
    } else {
      this.Usages = []; // Clear Usages dropdown if no Type Usage is selected
    }
  }
  
}