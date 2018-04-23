import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardhistoryTableComponent } from './cardhistory-table.component';

describe('LogTableComponent', () => {
  let component: CardhistoryTableComponent;
  let fixture: ComponentFixture<CardhistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardhistoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardhistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
