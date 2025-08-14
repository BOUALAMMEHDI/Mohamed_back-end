import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcheteurComponent } from './acheteur.component';

describe('AcheteurComponent', () => {
  let component: AcheteurComponent;
  let fixture: ComponentFixture<AcheteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcheteurComponent]
    });
    fixture = TestBed.createComponent(AcheteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
