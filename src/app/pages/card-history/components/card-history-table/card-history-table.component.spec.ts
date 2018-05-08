import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHistoryTableComponent } from './card-history-table.component';

describe('LogTableComponent', () => {
  let component: CardHistoryTableComponent;
  let fixture: ComponentFixture<CardHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardHistoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
