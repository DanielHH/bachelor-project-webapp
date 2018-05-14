import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHistoryItemComponent } from './card-history-item.component';

describe('CardHistoryItemComponent', () => {
  let component: CardHistoryItemComponent;
  let fixture: ComponentFixture<CardHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
