import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptItemComponent } from './receipt-item.component';

describe('ReceiptItemComponent', () => {
  let component: ReceiptItemComponent;
  let fixture: ComponentFixture<ReceiptItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
