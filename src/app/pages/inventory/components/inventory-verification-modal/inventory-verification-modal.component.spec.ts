import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryVerificationModalComponent } from './inventory-verification-modal.component';

describe('InventoryVerificationModalComponent', () => {
  let component: InventoryVerificationModalComponent;
  let fixture: ComponentFixture<InventoryVerificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryVerificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
