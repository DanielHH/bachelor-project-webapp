import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentOutputComponent } from './component-output.component';

describe('ComponentOutputComponent', () => {
  let component: ComponentOutputComponent;
  let fixture: ComponentFixture<ComponentOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
