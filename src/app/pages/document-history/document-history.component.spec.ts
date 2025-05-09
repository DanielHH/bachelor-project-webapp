import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentHistoryComponent } from './document-history.component';

describe('DocumentHistoryComponent', () => {
  let component: DocumentHistoryComponent;
  let fixture: ComponentFixture<DocumentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
