import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

// Mock HeaderComponent
@Component({
  selector: 'app-header',
  template: '<div>Mock Header</div>',
})
class MockHeaderComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkServerStatus']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        MockHeaderComponent, // Include the mock HeaderComponent
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'charging-app'`, () => {
    expect(component.title).toEqual('charging-app');
  });

  it('should check server status every 30 seconds', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    expect(authServiceSpy.checkServerStatus).not.toHaveBeenCalled();

    tick(30000);
    expect(authServiceSpy.checkServerStatus).toHaveBeenCalledTimes(1);

    tick(30000);
    expect(authServiceSpy.checkServerStatus).toHaveBeenCalledTimes(2);

    discardPeriodicTasks(); // Clear any remaining timers
  }));

  it('should unsubscribe from server check on destroy', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    const unsubscribeSpy = spyOn(
      component['serverCheckSubscription'],
      'unsubscribe'
    ).and.callThrough();

    tick(30000);
    expect(authServiceSpy.checkServerStatus).toHaveBeenCalledTimes(1);

    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);

    tick(30000);

    discardPeriodicTasks(); // Clear any remaining timers
  }));
});
