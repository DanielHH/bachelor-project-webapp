import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentHistoryTableComponent } from './document-history-table.component';

describe('DocumentHistoryTableComponent', () => {
  let component: DocumentHistoryTableComponent;
  let fixture: ComponentFixture<DocumentHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentHistoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
