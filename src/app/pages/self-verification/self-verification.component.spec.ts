import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfVerificationComponent } from './self-verification.component';

describe('SelfVerificationComponent', () => {
  let component: SelfVerificationComponent;
  let fixture: ComponentFixture<SelfVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
