import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentInoutComponent } from './component-inout.component';

describe('ComponentInoutComponent', () => {
  let component: ComponentInoutComponent;
  let fixture: ComponentFixture<ComponentInoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentInoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentInoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
