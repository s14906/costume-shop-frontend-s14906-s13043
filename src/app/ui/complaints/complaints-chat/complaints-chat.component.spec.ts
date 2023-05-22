import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsChatComponent } from './complaints-chat.component';

describe('ComplaintsChatComponent', () => {
  let component: ComplaintsChatComponent;
  let fixture: ComponentFixture<ComplaintsChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintsChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
