import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTypeComponent } from './modify-type.component';

describe('ModifyTypeComponent', () => {
  let component: ModifyTypeComponent;
  let fixture: ComponentFixture<ModifyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
