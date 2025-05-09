import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTableComponent } from './receipt-table.component';

describe('ReceiptsTableComponent', () => {
  let component: ReceiptTableComponent;
  let fixture: ComponentFixture<ReceiptTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
