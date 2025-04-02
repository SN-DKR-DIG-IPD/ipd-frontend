import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {LucideAngularModule} from "lucide-angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private translate: TranslateService) {
    translate.setDefaultLang('fr');
  }
  title = 'ipd-front';
}
