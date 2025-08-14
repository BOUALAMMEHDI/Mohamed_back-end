import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OperationService } from '../services/operation.service';
import { Vehicle } from '../Models/historique.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent {
  constructor(private http: HttpClient,private operationService: OperationService) {}

  carburants: any[] = []; // Array to store the list of carburants
  Usages: any[] = []; // Array to store the list of carburants
  selectedOperation: number | undefined;
  Typeusages : any[] = []; // Holds the available types of usage
  selectedtype:number | undefined;

  vehicle: Vehicle = new Vehicle();  // Create an instance of the Vehicle model
  ngOnInit() {
    this.fetchCarburants(); 
    this.loadTypeUsages();
  
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
