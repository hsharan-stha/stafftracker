import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  selectedLanguage = "En";
  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log(this.translateService.currentLang);
    if(this.translateService.currentLang){
      this.selectedLanguage = this.translateService.currentLang;
    }
  }
  languageChanges(lang: string, $event): void {
    localStorage.setItem("language", lang);
    this.selectedLanguage = lang;
    this.translateService.use(lang);
    $event.preventDefault();
  }

}
