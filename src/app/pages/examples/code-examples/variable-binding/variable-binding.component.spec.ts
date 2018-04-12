import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableBindingComponent } from './variable-binding.component';

describe('VariableBindingComponent', () => {
  let component: VariableBindingComponent;
  let fixture: ComponentFixture<VariableBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
