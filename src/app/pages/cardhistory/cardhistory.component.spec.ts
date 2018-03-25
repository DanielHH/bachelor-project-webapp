import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardhistoryComponent } from './cardhistory.component';

describe('CardhistoryComponent', () => {
  let component: CardhistoryComponent;
  let fixture: ComponentFixture<CardhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
