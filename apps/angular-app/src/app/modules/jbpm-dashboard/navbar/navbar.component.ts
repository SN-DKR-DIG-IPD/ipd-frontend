import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ILanguage} from "../../../data/model/langage.model";
import {
  SharedStyleServiceService, Theme
} from "../../../shared/services/styleConfig/shared-style-service.service";
import {Subscription} from "rxjs";
import {TranslateService} from '@ngx-translate/core'

@Component({
  selector: 'jbpm-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit, OnDestroy {
  isLanguageMenuOpen = false;
  selectedLanguage!: ILanguage ;
  isThemeModalOpen = false;
  activeTheme!:Theme;
  selectedTheme!:Theme;
  themes!: Theme [];
  activeTab: 'themes' | 'colors'|'typography'|'sidebar' = 'themes';

  private themeSubscription!: Subscription;
  private typographySubscription!: Subscription;
  private sidebarColorsSubscription!: Subscription;

  languages: ILanguage[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  constructor(
    private router: Router,
    private sharedStylesService: SharedStyleServiceService,
    private translate: TranslateService) {
    const currentLocale = window.location.pathname.split('/')[1];
    this.selectedLanguage = this.languages.find(lang => lang.code === currentLocale) || this.languages[1];

    //   translation
    translate.addLangs(['fr','en'])
    translate.setDefaultLang('en')
    const browserLang = translate.getBrowserLang();
    if (browserLang != null) {
      translate.use(browserLang)
    }
  }



  selectLanguage(language: ILanguage): void {
    if (language.code !== this.selectedLanguage.code) {

      this.selectedLanguage = language;
      this.translate.use(language.code);
    }
    console.log("**", language)
    this.translate.use(language.code)
    this.isLanguageMenuOpen = false;
  }


  customColors = {
    background: '#dc2626',
    text: '#ffffff',
    buttonBackground: '#ffffff',
    buttonText: '#000000'
  };

  typographySettings = {
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    fontWeight: 'font-normal'
  };

  sidebarColors = {
    background: '#f9fafb',
    logoText: '#dc2626',
    itemText: '#4b5563',
    activeItemText: '#dc2626',
    activeItemBg: '#fee2e2'
  };

  fontFamilies = [
    { value: 'font-sans', label: 'fontFamilies.sansSerif' },
    { value: 'font-serif', label: 'fontFamilies.serif' },
    { value: 'font-mono', label: 'fontFamilies.monospace' }
  ];

  fontSizes = [
    { value: 'text-sm', label: 'fontSizes.small' },
    { value: 'text-base', label: 'fontSizes.medium' },
    { value: 'text-lg', label: 'fontSizes.large' },
    { value: 'text-xl', label: 'fontSizes.extraLarge' },
  ];

  fontWeights = [
    { value: 'font-normal', label: 'fontWeights.normal' },
    { value: 'font-medium', label: 'fontWeights.medium' },
    { value: 'font-semibold', label: 'fontWeights.semibold' },
    { value: 'font-bold', label: 'fontWeights.bold' },
  ];



  ngOnInit(): void {
    this.themeSubscription = this.sharedStylesService.activeTheme$.subscribe(
      theme => {
        this.activeTheme = theme;
        this.selectedTheme = theme;

        if (theme.customColors) {
          this.customColors = {
            ...theme.customColors
          };
        }
        if (theme.typography) {
          this.typographySettings = {
            ...theme.typography,
          };
        }
        if (theme.sidebar.customColors) {
          this.sidebarColors = {
            ...theme.sidebar.customColors
          };
        }
      }
    );

    this.typographySubscription = this.sharedStylesService.typography$.subscribe(
      settings => {
        this.typographySettings = {...settings};
      }
    )
    this.sidebarColorsSubscription = this.sharedStylesService.sidebarColor$.subscribe(
      colors => {
        this.sidebarColors = { ...colors };
      }
    );
    this.themes = this.sharedStylesService.getAllThemes();
  }

  ngOnDestroy(){
    this.themeSubscription.unsubscribe();
    this.typographySubscription.unsubscribe();
    this.sidebarColorsSubscription.unsubscribe();
  }

  setActiveTab(tab: 'themes' | 'colors'|'typography'|'sidebar'): void {
    this.activeTab = tab;
  }


  toggleThemeModal(): void {
    this.isThemeModalOpen = !this.isThemeModalOpen;
  }

  selectTheme(theme:Theme){
    this.selectedTheme = theme
    console.log("**"+theme)
  }

  // applyTheme(): void {
  //   const updatedTheme = {
  //     ...this.selectedTheme,
  //     customColors: { ...this.customColors }
  //   };
  //   this.sharedStylesService.setActiveTheme(updatedTheme.id);
  //   this.isThemeModalOpen = false;
  // }

  applyChanges(): void {
    if (this.activeTab === 'themes') {
      this.sharedStylesService.setActiveTheme(this.selectedTheme.id);
    } else if (this.activeTab === 'colors') {
      this.sharedStylesService.updateCustomColors(this.customColors);
    } else if (this.activeTab === 'typography') {
      this.sharedStylesService.updateTypography(this.typographySettings);
    } else if (this.activeTab === 'sidebar') {
      this.sharedStylesService.updateSidebarColors(this.sidebarColors);
    }
    this.isThemeModalOpen = false;
  }

  removeThemeSelection(): void {
    this.selectedTheme = this.activeTheme;
    if (this.activeTab === 'colors') {
      this.customColors = { ...this.activeTheme.customColors! };
    } else if (this.activeTab === 'typography') {
      this.typographySettings = { ...this.activeTheme.typography! };
    } else if (this.activeTab === 'sidebar') {
      this.sidebarColors = { ...this.activeTheme.sidebar.customColors! };
    }
    this.isThemeModalOpen = false;
  }

  // updateCustomColor(property: keyof typeof this.customColors, event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input?.value) {
  //     this.customColors[property] = input.value;
  //   }
  // }
  updateCustomColor(property: keyof typeof this.customColors, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.customColors = {
        ...this.customColors,
        [property]: input.value
      };
    }
  }

  updateTypography(property: keyof typeof this.typographySettings, value: string): void {
    this.typographySettings = {
      ...this.typographySettings,
      [property]: value
    };
  }

  updateSidebarColor(property: keyof typeof this.sidebarColors, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.sidebarColors = {
        ...this.sidebarColors,
        [property]: input.value
      };
    }
  }

  // removeThemeSelection(): void {
  //   this.selectedTheme = this.activeTheme;
  //   this.isThemeModalOpen = false;
  // }

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    console.log('** is open')
  }

  logout(){
  		sessionStorage.removeItem('defaultHeader')
		  sessionStorage.removeItem('username')
      this.redirect()
  }

  redirect() {
  	this.router.navigate(['login']).then(r => console.log(r));
  }

}
