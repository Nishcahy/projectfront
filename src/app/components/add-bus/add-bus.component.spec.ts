import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBUsComponent } from './add-bus.component';

describe('AddBUsComponent', () => {
  let component: AddBUsComponent;
  let fixture: ComponentFixture<AddBUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
