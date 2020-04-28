import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from './core/takeUntil-function';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StaffTrackerV2';
  languages = [
    { code: 'En', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'Ru', label: 'Russian' }
];
constructor(
    //@Inject(LOCALE_ID) private  localeId: string ,
    private _translate: TranslateService
) { }
ngOnInit() {
    let defaultLanguage = localStorage.getItem('language');
    console.log(navigator.languages);
    if (defaultLanguage) {
        this._translate.use(defaultLanguage);
    }
    else {
       localStorage.setItem("language", "En");
        this._translate.setDefaultLang("En");
        this._translate.use("En");
    }
    this._translate.onLangChange.pipe(takeUntil(componentDestroyed(this))).subscribe((event: LangChangeEvent) => {
        console.log(event);
    });     
}
ngOnDestroy(): void {
}

}
