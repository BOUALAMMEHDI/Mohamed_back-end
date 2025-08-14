import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { OperationService } from '../services/operation.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private http: HttpClient,private operationService: OperationService) {}
  typeUsages: any[] = []; // Array to hold fetched usage types
  usageTypes: any[] = [];
  carburants: any[] = [];
  usages: any[] = [];

  loadTypeUsages() {
    this.operationService.getTypeUsages().subscribe(
      (data) => {
        this.typeUsages = data;
        this.showTypeUsageForm(); // Re-render table with updated data
      },
      (error) => {
        console.error('Error loading type usages:', error);
      }
    );
  }
  loadCarburants(): void {
    this.operationService.getCarburants().subscribe(
      (data) => {
        this.carburants = data;
      },
      (error) => {
        console.error('Error fetching carburants:', error);
      }
    );
  }
  loadusages(): void {
    this.operationService.getUsage().subscribe(
      (data) => {
        this.usages = data;
      },
      (error) => {
        console.error('Error fetching carburants:', error);
      }
    );
  }
  ngOnInit(): void {
    this.loadTypeUsages();
    this.loadCarburants();
    this.loadusages();
  }
  
  showAjoutationForm() {
    Swal.fire({
      title: '',
      html: `
        <div style="display: flex; width: 100%; height: 300px; background: linear-gradient(90deg, #f0f4f8, #e8f7fc);">
        <!-- Sidebar with stacked buttons -->
        <div style="flex: 0 0 25%; background-color: #ffffff; padding: 10px; border-right: 2px solid #d9edf7; display: flex; flex-direction: column; gap: 10px; box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);">
        <button class="btn btn-outline-primary" id="carburantBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Carburant</button>
          <button class="btn btn-outline-primary" id="genreBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Genre</button>
          <button class="btn btn-outline-primary" id="marqueBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Marque</button>
          <button class="btn btn-outline-primary" id="typeUsageBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Type Usage</button>
          <button class="btn btn-outline-primary" id="typeBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Type</button>
          <button class="btn btn-outline-primary" id="usageBtn" style="background-color: #17a2b8; color: #fff; font-weight: bold;">Usage</button>
        </div>

        <!-- Dynamic Content Section -->
        <div id="dynamicSection" style="flex: 1; padding: 20px; overflow-y: auto;  border-radius: 0 5px 5px 0;">
          <h3 style="text-align: center; color: #6c757d;">Please select an option</h3>
        </div>
      </div>
      `,
      width: '70%',
      padding: '30px',
      showCancelButton: true,
      cancelButtonText: 'Close',
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-custom-popup', 
        title: 'swal2-custom-title',
        cancelButton: 'swal2-custom-cancel-btn',
        htmlContainer: 'swal2-custom-html-container'
      },
      didOpen: () => {
        // Now that the modal is open, add event listeners for the buttons
        document.getElementById('carburantBtn')?.addEventListener('click', () => this.showCarburantForm());
        document.getElementById('typeUsageBtn')?.addEventListener('click', () => this.showTypeUsageForm());
        document.getElementById('usageBtn')?.addEventListener('click', () => this.showUsageForm());

      }
    });
  }
  Actualiser(){
    Swal.fire({
      title: 'Actualisation réussie!',
      text: 'Les données ont été actualisées avec succès.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    
    this.loadCarburants();

        this.loadTypeUsages();
    this.loadusages();
    this.showAjoutationForm();
  }
showCarburantForm() {
  const tableRows = this.carburants
    .map(
      c => `
        <tr>
          <td>${c.id_carburant}</td>
          <td>${c.libelle}</td>
          <td>
           <button class="btn btn-warning btn-sm modify-btn" data-id="${c.id_carburant}">
  Modify <!-- Text for Modify -->
</button>
<button class="btn btn-danger btn-sm delete-btn" data-id="${c.id_carburant}">
  Delete <!-- Text for Delete -->
</button>

          </td>
        </tr>`
    )
    .join('');

  document.getElementById('dynamicSection')!.innerHTML = `
        <h3 class="section-title">Carburant</h3>

    <input type="text" class="swal-input" placeholder="Enter Carburant" id="carburantInput">
    <button class="btn btn-success mt-3" id="saveCarburantBtn">Save</button>
    <br>
    <br>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  // Add event listener for save button
  document.getElementById('saveCarburantBtn')?.addEventListener('click', () => {
    const carburantValue = (document.getElementById('carburantInput') as HTMLInputElement).value;

    this.operationService.saveData('carburant', carburantValue).subscribe(
      (response) => {
        console.log(response);
        Swal.fire('Saved!', `Carburant: ${carburantValue}`, 'success');
        this.showAjoutationForm();
        this.Actualiser()

      },
      (error) => {
        // console.error('Error saving carburant:', error);
        Swal.fire('Saved!', ``, 'success');
        this.showAjoutationForm();
        this.Actualiser();

      }
    );
    this.loadCarburants();

  });

  // Add event listeners for Modify and Delete buttons using event delegation
  const tableBody = document.querySelector('tbody');
  tableBody?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const id = parseInt(target.getAttribute('data-id') || '0', 10);

    if (target.classList.contains('delete-btn')) {
      this.deleteCarburant(id);
    } else if (target.classList.contains('modify-btn')) {
      this.modifyCarburant(id);
    }
  });
}

// Delete carburant
deleteCarburant(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.operationService.deleteCarburant(id).subscribe(
        (response) => {
          Swal.fire('Deleted!', 'Your carburant has been deleted.', 'success');
          this.showAjoutationForm();
          this.Actualiser();
  

        },
        (error) => {
          console.error('Error deleting carburant:', error);
          // Swal.fire('Error', 'There was an error deleting the carburant.', 'error');
        }
      );
    }
  });
}

// Modify carburant
modifyCarburant(id: number) {
  const carburant = this.carburants.find(c => c.id_carburant === id);
  if (carburant) {
    Swal.fire({
      title: 'Modify Carburant',
      input: 'text',
      inputLabel: 'New Name',
      inputValue: carburant.libelle,
      showCancelButton: true,
      confirmButtonText: 'Save',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCarburant = { id_carburant: id, libelle: result.value };

        this.operationService.updateCarburant(updatedCarburant).subscribe(
          (response) => {
            Swal.fire('Modified!', 'Your carburant has been updated.', 'success');
            this.showAjoutationForm();
            this.Actualiser();
    

          },
          (error) => {
            console.error('Error modifying carburant:', error);
            Swal.fire('Error', 'There was an error modifying the carburant.', 'error');
          }
        );
      }
    });
  }
}
  showTypeUsageForm() {
    const tableRows = this.typeUsages
      .map(
        (typeUsage) => `
          <tr>
            <td>${typeUsage.tyUsCode}</td>
            <td>${typeUsage.tyUsLibe}</td>
            <td>
              <button class="btn btn-warning btn-sm modify-btn" data-id="${typeUsage.tyUsCode}">
  Modify <!-- Text for Modify -->
</button>
<button class="btn btn-danger btn-sm delete-btn" data-id="${typeUsage.tyUsCode}">
  Delete <!-- Text for Delete -->
</button>

            </td>
          </tr>`
      )
      .join('');
  
    document.getElementById('dynamicSection')!.innerHTML = `
      <h3 class="section-title">Type Usage</h3>
      <input type="text" class="swal-input" placeholder="Enter Type Usage" id="typeUsageInput">
      <button class="btn btn-success mt-3" id="saveTypeUsageBtn">Save</button>
      <br><br>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
  
    // Add event listener for save button
    document.getElementById('saveTypeUsageBtn')?.addEventListener('click', () => {
      const typeUsageValue = (document.getElementById('typeUsageInput') as HTMLInputElement).value;
  
      this.operationService.saveData('typeusage', typeUsageValue).subscribe(
        (response) => {
          Swal.fire('Saved!', `Type Usage: ${typeUsageValue}`, 'success');
          this.showAjoutationForm();
          this.Actualiser()

        },
        (error) => {
          console.error('Error saving type usage:', error);
          // Swal.fire('Error', 'There was an error saving the type usage', 'error');
          Swal.fire('Saved!', ``, 'success');
          this.showAjoutationForm();
          this.Actualiser();
  
        }
      );
    });
  
    // Add event listeners for Modify and Delete buttons using event delegation
    const tableBody = document.querySelector('tbody');
    tableBody?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const id = parseInt(target.getAttribute('data-id') || '0', 10);
  
      if (target.classList.contains('delete-btn')) {
        this.deleteTypeUsage(id);
      } else if (target.classList.contains('modify-btn')) {
        this.modifyTypeUsage(id);
      }
    });
  }
  
  // Delete Type Usage
  deleteTypeUsage(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService.deleteTypeUsage(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'Your Type Usage has been deleted.', 'success');
            this.showAjoutationForm();
            this.Actualiser();
    
          },
          (error) => {
            console.error('Error deleting type usage:', error);
            Swal.fire('Error', 'There was an error deleting the type usage.', 'error');
          }
        );
      }
    });
  }
  
  modifyTypeUsage(id: number) {
    const typeUsage = this.typeUsages.find((t) => t.tyUsCode === id);
    if (typeUsage) {
      Swal.fire({
        title: 'Modify Type Usage',
        input: 'text',
        inputLabel: 'New Name',
        inputValue: typeUsage.tyUsLibe, // Ensure correct field name (tyUsLibe)
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        if (result.isConfirmed) {
          // Ensure TyUsLibe is a string
          const updatedTypeUsage = { TyUsCode: id, TyUsLibe: String(result.value) };
  
          this.operationService.updateTypeUsage(updatedTypeUsage).subscribe(
            (response) => {
              Swal.fire('Modified!', 'Your Type Usage has been updated.', 'success');
              this.showAjoutationForm();
              this.Actualiser();
      

            },
            (error) => {
              console.error('Error modifying type usage:', error);
              Swal.fire('Error', 'There was an error modifying the type usage.', 'error');
            }
          );
        }
      });
    }
  }showUsageForm() {
    // Ensure this.usageTypes is populated with the appropriate data
    const dropdownOptions = this.typeUsages.map(option => {
      return `<option value="${option.tyUsCode}">${option.tyUsLibe}</option>`;
    }).join(''); // Add your Type Usage options here
  
    // Dynamically generate HTML for the Usage form
    document.getElementById('dynamicSection')!.innerHTML = `
      <h3 class="section-title">Usage</h3>
      <input type="text" class="swal-input" placeholder="Enter Usage Name" id="usageInputText">
      <select class="swal-input" id="usageSelect">
        <option value="">Select Type Usage</option>
        ${dropdownOptions}
      </select>
      <button class="btn btn-success mt-3" id="saveUsageBtn">Save</button>
      <br><br>
      <table class="table table-bordered" id="usageTable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Type Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="usageTableBody"></tbody>
      </table>
    `;
  
    // Event listener for saving new usage
    document.getElementById('saveUsageBtn')?.addEventListener('click', this.saveUsage.bind(this));
   

    // Load and display existing usages
    this.loadUsages();
  }
  
  loadUsages() {
    // Assuming `this.usages` holds your usages
    const tableBody = document.getElementById('usageTableBody')!;
    tableBody.innerHTML = ''; // Clear previous rows
  
    this.usages.forEach(usage => {
      tableBody.innerHTML += `
        <tr>
          <td>${usage.codeUsag}</td>
          <td>${usage.libeUsag}</td>
          <td>${usage.tyUsCode}</td> <!-- Replace with correct data -->
          <td>
            <button class="btn btn-warning btn-sm modify-btn" data-id="${usage.codeUsag}">
              Modify
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${usage.codeUsag}">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
  
    // Event listener for Modify/Delete buttons
    const tableBodyEl = document.querySelector('#usageTableBody');
    tableBodyEl?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const id = parseInt(target.getAttribute('data-id') || '', 10);
      if (target.classList.contains('delete-btn')) {
        this.deleteUsage(id);
      } else if (target.classList.contains('modify-btn')) {
        this.modifyUsage(id);  // Make sure this line calls modifyUsage
      }
    });
  }
  
  deleteUsage(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService.deleteUsage(id).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Usage has been deleted successfully.', 'success');
            this.showAjoutationForm();
            this.Actualiser()

          },
          (error) => {
            console.error('Error deleting usage:', error);
            Swal.fire('Error', 'There was an error deleting the usage.', 'error');
          }
        );
      }
    });
    this.loadusages();

  }
  
  modifyUsage(id: number) {
    const usage = this.usages.find((u) => u.codeUsag === id);
    
    if (usage) {
      // Populate the dropdown for type usage
      const dropdownOptions = this.typeUsages.map(option => {
        return `<option value="${option.tyUsCode}" ${option.tyUsCode === usage.tyUsCode ? 'selected' : ''}>${option.tyUsLibe}</option>`;
      }).join('');
  
      // Show Swal modal with both input and dropdown
      Swal.fire({
        title: 'Modify Usage',
        html: `
          <label for="libeUsag">New Name</label>
          <input type="text" id="libeUsag" class="swal2-input" value="${usage.libeUsag}" placeholder="Enter new usage name">
          <label for="tyUsCode">Select Type Usage</label>
          <select id="tyUsCode" class="swal2-input">
            <option value="">Select Type Usage</option>
            ${dropdownOptions}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
          const newName = (document.getElementById('libeUsag') as HTMLInputElement).value;
          const selectedTypeUsage = (document.getElementById('tyUsCode') as HTMLSelectElement).value;
  
          if (!newName || !selectedTypeUsage) {
            Swal.showValidationMessage('Both name and type usage are required');
            return false;
          }
  
          return { newName, selectedTypeUsage };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedUsage = {
            CodeUsag: usage.codeUsag,
            LibeUsag: result.value.newName,
            TyUsCode: result.value.selectedTypeUsage
          };
  
          this.operationService.updateUsage(updatedUsage).subscribe(
            (response) => {
              Swal.fire('Modified!', 'Usage has been updated successfully.', 'success');
              this.showAjoutationForm();
              this.Actualiser()

            },
            (error) => {
              console.error('Error modifying usage:', error);
              // Swal.fire('Error', 'There was an error modifying the usage.', 'error');
            }
          );
        }
      });
    } else {
      Swal.fire('Error', 'Usage not found.', 'error');
    }
    this.loadusages();

  }
  
  
  
  
    
saveUsage() {
  // Capture input values
  const usageText = (document.getElementById('usageInputText') as HTMLInputElement).value;
  const usageSelect = (document.getElementById('usageSelect') as HTMLSelectElement);
  const selectedIndex = usageSelect.selectedIndex;

  console.log(usageText);
  console.log(selectedIndex);

  // Validate input
  if (!usageText || selectedIndex === -1) {
    alert('Please provide both a Usage name and select an option.');
    return;
  }

  const currentCodeUsag = 16; // Set the initial value or retrieve from your state

  // Ensure you're sending the ID from the dropdown option as TyUsCode
  const selectedTyUsCode = usageSelect.value; // The value attribute in the <option> tag should be TyUsCode (TypeUsage ID)

  // Create the usage object with the correct field names
  const usageData = {
    // CodeUsag: currentCodeUsag + 1,    // Incremented CodeUsag
    LibeUsag: usageText,      
    TyUsCode: selectedTyUsCode, // Corrected to send TyUsCode (not selectedIndex)
  };

  // Call the service to save the new usage
  this.operationService.addUsage(usageData).subscribe(
    (response: any) => {
      console.log('Usage saved:', response);
      this.showAjoutationForm();
      this.Actualiser()

      Swal.fire('Saved!', `Type Usage: ${response}`, 'success');

    },
    (error: any) => {
      console.error('Error saving usage:', error);
      Swal.fire('Saved!', ``, 'success');
      this.showAjoutationForm();
      this.Actualiser();
  }
  ); 
     this.loadusages();

}



  
}
