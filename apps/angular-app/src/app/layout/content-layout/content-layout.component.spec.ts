import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentLayoutComponent } from './content-layout.component';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from '../../core/service/theme/theme.service';
import { ThemeModel } from '../../data/model/theme.model';
import defaultTheme from '../../data/json/default.theme.json';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContentLayoutComponent', () => {
  let component: ContentLayoutComponent;
  let fixture: ComponentFixture<ContentLayoutComponent>;
  const mockTheme: ThemeModel = defaultTheme;

  beforeEach(async () => {
    const themeServiceSpyObj = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    themeServiceSpyObj.theme$ = new BehaviorSubject<ThemeModel>(mockTheme);

    await TestBed.configureTestingModule({
      declarations: [ContentLayoutComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpyObj }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sidebar and settings panel state', () => {
    expect(component.isSidebarOpen).toBeFalse();
    expect(component.isSettingsPanelOpen).toBeFalse();
  });

  it('should toggle sidebar menu state', () => {
    // Initial state
    expect(component.isSidebarOpen).toBeFalse();

    // Toggle sidebar to open
    component.toggleSidbarMenu(true);
    expect(component.isSidebarOpen).toBeTrue();

    // Toggle sidebar to close
    component.toggleSidbarMenu(false);
    expect(component.isSidebarOpen).toBeFalse();
  });
});
