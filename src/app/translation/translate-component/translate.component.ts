import { Component, OnInit, Input,ViewChild,ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-translate',
    templateUrl: './translate.component.html',
    styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {
    @Input() color = "#fff";
    selectedLanguage = "En";
    @ViewChild('langPanelWrapper') langPanelWrapper: ElementRef;
    constructor(private translateService: TranslateService) { }

    ngOnInit() {
        if(this.translateService.currentLang)
        this.selectedLanguage = this.translateService.currentLang;
    }
    languageChanges(lang: string, $event): void {
        localStorage.setItem("language", lang);
        this.selectedLanguage = lang;
        this.translateService.use(lang);
        $event.preventDefault();
    }
    toggleLanguage(){
        if(this.langPanelWrapper.nativeElement.classList.contains('close-panel')){
            this.langPanelWrapper.nativeElement.classList.remove('close-panel');
        }else{
            this.langPanelWrapper.nativeElement.classList.add('close-panel');
        }
        
    }
}
