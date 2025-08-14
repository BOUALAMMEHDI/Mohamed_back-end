import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierCarteGriseComponent } from './dossier-carte-grise.component';

describe('DossierCarteGriseComponent', () => {
  let component: DossierCarteGriseComponent;
  let fixture: ComponentFixture<DossierCarteGriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DossierCarteGriseComponent]
    });
    fixture = TestBed.createComponent(DossierCarteGriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
