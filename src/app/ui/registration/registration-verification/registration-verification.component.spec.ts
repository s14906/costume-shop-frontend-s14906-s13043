import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationVerificationComponent } from './registration-verification.component';

describe('RegistrationVerificationComponent', () => {
  let component: RegistrationVerificationComponent;
  let fixture: ComponentFixture<RegistrationVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
