import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface StyleConfig {

  headerBgColor: string;
  headerCustomColor: string;
  headerTextSize: string;
  headerIconSize: number;


  sidebarBgColor: string;
  sidebarCustomColor: string;
  sidebarWidth: string;
  sidebarTextSize: string;
  sidebarIconSize: number;
  sidebarLogoColor: string;

  logoSectionBgColor: string;
  logoCustomBgColor: string;
  logoTextColor: string;

  navItemColor: string;
  navItemActiveColor: string
}

export interface Theme {
  id: string;
  name: string;
  background: string;
  text: string;
  buttonBorder: string;
  buttonHover: string;
  iconHover: string;
  textSize: string;
  buttonPadding: string;
  preview: string;
  sidebar: {
    background: string;
    logoTextColor: string;
    navItemTextColor: string;
    activeNavItemTextColor: string;
    activeNavItemBg: string;
    navItemHover: string;
    customColors: {
      background: string;
      logoText: string;
      itemText: string;
      activeItemText: string;
      activeItemBg: string;
    };
  };
  customColors: {
    background: string;
    text: string;
    buttonBackground: string;
    buttonText: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
  };
}



@Injectable({
  providedIn: 'root'
})
export class SharedStyleServiceService {


  constructor() {
    this.loadSavedSettings()
  }

  private themes: { [key: string]: Theme } = {
    default: {
      id: 'default',
      name: 'Default',
      background: 'bg-red-600',
      text: 'text-white',
      buttonBorder: 'border-black-900',
      buttonHover: 'hover:bg-red-600',
      iconHover: 'hover:text-blue-500',
      textSize: 'text-sm',
      buttonPadding: 'px-4 py-1.5',
      preview: 'bg-red-600',
      sidebar: {
        background: 'bg-gray-50',
        logoTextColor: 'text-red-600',
        navItemTextColor: 'text-gray-600',
        activeNavItemTextColor: 'text-red-600',
        activeNavItemBg: 'bg-blue-100',
        navItemHover: 'hover:bg-blue-50',
        // for sidebar
        customColors: {
          background: '#f9fafb',
          logoText: '#dc2626',
          itemText: '#4b5563',
          activeItemText: '#dc2626',
          activeItemBg: '#fee2e2'
        }
      },
      customColors: {
        background: '#dc2626',
        text: '#ffffff',
        buttonBackground: '#ffffff',
        buttonText: '#000000'
      },
      typography: {
        fontFamily: 'font-sans',
        fontSize: 'text-base',
        fontWeight: 'font-normal'
      },
    },
    dark: {
      id: 'dark',
      name: 'Dark',
      background: 'bg-gray-800',
      text: 'text-white',
      buttonBorder: 'border-gray-600',
      buttonHover: 'hover:bg-gray-700',
      iconHover: 'hover:text-blue-400',
      textSize: 'text-sm',
      buttonPadding: 'px-4 py-1.5',
      preview: 'bg-gray-800',
      sidebar: {
        background: 'bg-gray-900',
        logoTextColor: 'text-blue-500',
        navItemTextColor: 'text-gray-400',
        activeNavItemTextColor: 'text-white',
        activeNavItemBg: 'bg-gray-700',
        navItemHover: 'hover:bg-gray-800',
        customColors: {
          background: '#111827',
          logoText: '#3b82f6',
          itemText: '#9ca3af',
          activeItemText: '#ffffff',
          activeItemBg: '#374151'
        },
      },
      customColors: {
        background: '#1f2937',
        text: '#ffffff',
        buttonBackground: '#374151',
        buttonText: '#ffffff'
      },
      typography: {
        fontFamily: 'font-sans',
        fontSize: 'text-base',
        fontWeight: 'font-normal'
      },
    },
    light: {
      id: 'light',
      name: 'Light',
      background: 'bg-white',
      text: 'text-gray-800',
      buttonBorder: 'border-gray-300',
      buttonHover: 'hover:bg-gray-100',
      iconHover: 'hover:text-blue-600',
      textSize: 'text-sm',
      buttonPadding: 'px-4 py-1.5',
      preview: 'bg-white',
      sidebar: {
        background: 'bg-white',
        logoTextColor: 'text-blue-600',
        navItemTextColor: 'text-gray-700',
        activeNavItemTextColor: 'text-blue-600',
        activeNavItemBg: 'bg-blue-50',
        navItemHover: 'hover:bg-blue-100',
        customColors: {
          background: '#ffffff',
          logoText: '#2563eb',
          itemText: '#374151',
          activeItemText: '#2563eb',
          activeItemBg: '#eff6ff'
        }
      },
      customColors: {
        background: '#ffffff',
        text: '#1f2937',
        buttonBackground: '#f3f4f6',
        buttonText: '#1f2937'
      },
      typography: {
        fontFamily: 'font-sans',
        fontSize: 'text-base',
        fontWeight: 'font-normal'
      },
    },
    // blue: {
    //   id: 'blue',
    //   name: 'Blue',
    //   background: 'bg-blue-600',
    //   text: 'text-white',
    //   buttonBorder: 'border-blue-300',
    //   buttonHover: 'hover:bg-blue-700',
    //   iconHover: 'hover:text-blue-300',
    //   textSize: 'text-sm',
    //   buttonPadding: 'px-4 py-1.5',
    //   preview: 'bg-blue-600',
    //
    // },
    // purple: {
    //   id: 'purple',
    //   name: 'Purple',
    //   background: 'bg-purple-600',
    //   text: 'text-white',
    //   buttonBorder: 'border-purple-300',
    //   buttonHover: 'hover:bg-purple-700',
    //   iconHover: 'hover:text-purple-300',
    //   textSize: 'text-sm',
    //   buttonPadding: 'px-4 py-1.5',
    //   preview: 'bg-purple-600'
    // }
  };



  private activeThemeSubject = new BehaviorSubject<Theme>(this.themes['default']);
  activeTheme$ = this.activeThemeSubject.asObservable();

  private customColorsSubject = new BehaviorSubject<Theme['customColors']>({
    background: '#dc2626',
    text: '#ffffff',
    buttonBackground: '#ffffff',
    buttonText: '#000000'
  });
  customColors$ = this.customColorsSubject.asObservable();



  // private typographySettings = {
  //   fontFamily: 'font-sans',
  //   fontSize: 'text-base',
  //   fontWeight: 'font-normal'
  // };
  // private typographySubject = new BehaviorSubject(this.typographySettings);
  private typographySubject = new BehaviorSubject<Theme['typography']>({
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    fontWeight: 'font-normal'
  });
  typography$ = this.typographySubject.asObservable();

  private sidebarColorsSubject = new BehaviorSubject<Theme['sidebar']['customColors']>({
    background: '#f9fafb',
    logoText: '#dc2626',
    itemText: '#4b5563',
    activeItemText: '#dc2626',
    activeItemBg: '#fee2e2'
  })
  sidebarColor$ = this.sidebarColorsSubject.asObservable();

  getThemes(): { [key: string]: Theme } {
    return this.themes
  }

  getAllThemes():Theme [] {
    return Object.values(this.themes);
  }

  getCurrentActiveTheme():Theme {
    return this.activeThemeSubject.value;
  }

  setActiveTheme(themeId: string): void {
    const theme = this.themes[themeId];
    if (theme) {
      // reset custom color
      this.customColorsSubject.next(theme.customColors || this.customColorsSubject.value);
      this.activeThemeSubject.next(theme);
      localStorage.setItem('activeThemeId', themeId);
    }
  }

  updateCustomColors(colors: Theme['customColors']): void {
    this.customColorsSubject.next(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));

    const currentTheme = this.getCurrentActiveTheme();
    const updatedTheme = {
      ...currentTheme,
      customColors: colors
    };
    this.activeThemeSubject.next(updatedTheme);
  }

  updateTypography(settings: Theme['typography']): void {
    this.typographySubject.next(settings);
    localStorage.setItem('typography', JSON.stringify(settings));

    const currentTheme = this.getCurrentActiveTheme();
    const updatedTheme = {
      ...currentTheme,
      typography: settings
    };
    this.activeThemeSubject.next(updatedTheme);
  }

  updateSidebarColors(colors: Theme['sidebar']['customColors']): void {
    this.sidebarColorsSubject.next(colors);
    localStorage.setItem('sidebarColors', JSON.stringify(colors));

    const currentTheme = this.getCurrentActiveTheme();
    const updatedTheme = {
      ...currentTheme,
      sidebar: {
        ...currentTheme.sidebar,
        customColors: colors
      }
    };
    this.activeThemeSubject.next(updatedTheme);
  }



  // updateTypography(settings:typeof this.typographySettings):void {
  //   this.typographySubject.next(settings);
  //   localStorage.setItem('typography',JSON.stringify(settings));
  // }

  // loadSavedSettings(): void {
  //   // saved theme
  //   const savedThemeId = localStorage.getItem('activeThemeId');
  //   if (savedThemeId) {
  //     this.setActiveTheme(savedThemeId);
  //   }
  //
  //   // custom color
  //   const savedCustomColors = localStorage.getItem('customColors');
  //   if (savedCustomColors) {
  //     try {
  //       const colors = JSON.parse(savedCustomColors);
  //       this.customColorsSubject.next(colors);
  //     } catch (e) {
  //       console.error('Erreur lors du chargement des couleurs personnalisées:', e);
  //     }
  //   }
  //
  //   // font
  //   const savedTypography = localStorage.getItem('typography');
  //   if (savedTypography) {
  //     try {
  //       const typography = JSON.parse(savedTypography);
  //       this.typographySubject.next(typography);
  //     } catch (e) {
  //       console.error('Erreur lors du chargement de la typographie:', e);
  //     }
  //   }
  // }

  loadSavedSettings(): void {
    // Charger le thème actif
    const savedThemeId = localStorage.getItem('activeThemeId');
    if (savedThemeId && this.themes[savedThemeId]) {
      this.setActiveTheme(savedThemeId);
    }

    // Charger les couleurs personnalisées
    const savedCustomColors = localStorage.getItem('customColors');
    if (savedCustomColors) {
      try {
        const colors = JSON.parse(savedCustomColors);
        this.updateCustomColors(colors);
      } catch (e) {
        console.error('Erreur lors du chargement des couleurs personnalisées:', e);
      }
    }

    // Charger la typographie
    const savedTypography = localStorage.getItem('typography');
    if (savedTypography) {
      try {
        const typography = JSON.parse(savedTypography);
        this.updateTypography(typography);
      } catch (e) {
        console.error('Erreur lors du chargement de la typographie:', e);
      }
    }

    // Charger les couleurs de la sidebar
    const savedSidebarColors = localStorage.getItem('sidebarColors');
    if (savedSidebarColors) {
      try {
        const sidebarColors = JSON.parse(savedSidebarColors);
        this.updateSidebarColors(sidebarColors);
      } catch (e) {
        console.error('Erreur lors du chargement des couleurs de la sidebar:', e);
      }
    }
  }








}
