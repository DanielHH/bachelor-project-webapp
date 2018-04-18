import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardhistoryItemComponent } from './cardhistory-item.component';

describe('CardhistoryItemComponent', () => {
  let component: CardhistoryItemComponent;
  let fixture: ComponentFixture<CardhistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardhistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardhistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
