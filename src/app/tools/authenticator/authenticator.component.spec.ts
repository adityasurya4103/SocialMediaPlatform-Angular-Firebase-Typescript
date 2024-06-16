import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatorComponent } from './authenticator.component';

describe('AuthenticatorComponent', () => {
  let component: AuthenticatorComponent;
  let fixture: ComponentFixture<AuthenticatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticatorComponent]
    });
    fixture = TestBed.createComponent(AuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
