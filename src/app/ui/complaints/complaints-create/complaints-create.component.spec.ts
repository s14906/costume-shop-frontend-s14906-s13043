import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsCreateComponent } from './complaints-create.component';

describe('ComplaintsCreateComponent', () => {
  let component: ComplaintsCreateComponent;
  let fixture: ComponentFixture<ComplaintsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
