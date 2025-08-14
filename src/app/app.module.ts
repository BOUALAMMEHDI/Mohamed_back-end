import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DossierCarteGriseComponent } from './dossier-carte-grise/dossier-carte-grise.component';
import { AcheteurComponent } from './acheteur/acheteur.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { HeaderComponent } from './header/header.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ProprietaireComponent } from './proprietaire/proprietaire.component';
import { ReservationComponent } from './reservation/reservation.component';
import { VehiculeComponent } from './vehicule/vehicule.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    DossierCarteGriseComponent,
    AcheteurComponent,
    ConsultationComponent,
    HeaderComponent,
    HistoriqueComponent,
    ProprietaireComponent,
    ReservationComponent,
    VehiculeComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
