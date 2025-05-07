import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from '../../core/service/user/user.service';
import { ElementRef } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let keycloakServiceSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(async () => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const keycloakServiceSpyObj = jasmine.createSpyObj('KeycloakService', ['logout']);
    const elementRefSpyObj = jasmine.createSpyObj('ElementRef', ['nativeElement']);

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: KeycloakService, useValue: keycloakServiceSpyObj },
        { provide: ElementRef, useValue: elementRefSpyObj }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    keycloakServiceSpy = TestBed.inject(KeycloakService) as jasmine.SpyObj<KeycloakService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSidebarOpen to false by default', () => {
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should initialize user profile on ngOnInit', () => {
    // Arrange
    const userProfile = {};
    userServiceSpy.getUserProfile.and.returnValue(userProfile);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.userProfile).toEqual(userProfile);
    expect(userServiceSpy.getUserProfile).toHaveBeenCalled();
  });

  it('should close dropdown when clicking outside', () => {
    // Arrange
    const event = new MouseEvent('click');
    spyOn(document, 'contains').and.returnValue(false);

    // Act
    component.onClick(event);

    // Assert
    expect(component.isOpen).toBeFalse();
  });

  it('should close dropdown on outside click', () => {
    // Arrange
    component.isOpen = true;
    const event = new MouseEvent('click');
    spyOn(component, 'onClick').and.callThrough();

    // Act
    document.dispatchEvent(event);

    // Assert
    expect(component.onClick).toHaveBeenCalledWith(event);
    expect(component.isOpen).toBeFalse();
  });

  it('should toggle sidebar menu', () => {
    // Arrange
    spyOn(component.isSidebarOpenEvent, 'emit');

    // Act
    component.toggleSidbarMenuEvent();

    // Assert
    expect(component.isSidebarOpen).toBeTrue();
    expect(component.isSidebarOpenEvent.emit).toHaveBeenCalledWith(true);

    // Act
    component.toggleSidbarMenuEvent();

    // Assert
    expect(component.isSidebarOpen).toBeFalse();
    expect(component.isSidebarOpenEvent.emit).toHaveBeenCalledWith(false);
  });

  it('should toggle dropdown', () => {
    // Act
    component.toggleDropdown();

    // Assert
    expect(component.isOpen).toBeTrue();

    // Act
    component.toggleDropdown();

    // Assert
    expect(component.isOpen).toBeFalse();
  });

  it('should call logout', () => {
    // Act
    component.logout();

    // Assert
    expect(keycloakServiceSpy.logout).toHaveBeenCalled();
  });

});
