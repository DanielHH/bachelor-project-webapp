import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDocumentComponent } from './modify-document.component';

describe('ModifyDocumentComponent', () => {
  let component: ModifyDocumentComponent;
  let fixture: ComponentFixture<ModifyDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
