import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMenuComponent } from './item-menu.component';

describe('ItemMenuComponent', () => {
  let component: ItemMenuComponent;
  let fixture: ComponentFixture<ItemMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
