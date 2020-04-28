import { Injectable , Inject, EventEmitter } from '@angular/core';
import { TRANSLATIONS } from './translation';
@Injectable()

export class TranslateService {

    /**
     * Current Language of app
     *
     * @type {String}
     */
    private _currentLang : string ;

    /**
     * Default language for app
     *
     * @type {String}
     */
    private _defaultLang : string ;

    /**
     * Placeholder used in language json file
     *
     * @type {string}
     */
    private PLACEHOLDER = "%";

    public onLangChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(@Inject(TRANSLATIONS) private _translations : any){}

    /**
     * Get a current language. If current
     * lang is not found default language value
     * will be return*
     *
     * @return string
     */
    public currentLang():string {
        return this._currentLang || this._defaultLang ;
    }

    /**
     * Set a default language
     *
     * @param lang string
     * @return void
     */
    public setDefaultLang(lang : string ) : void {
        this._defaultLang = lang ;
    }

    public use(lang : string) : void {
        this._currentLang = lang ;
    }

    /**
     * Replace a place holder with a value passed
     *
     * @return string
     */
    public replace(word : string ='' , words : string | string[]= '') : string {
        let translation : string = word ;

        const values : string[] = [].concat(words);

        values.forEach((e,i)=>{
            translation = translation.replace(this.PLACEHOLDER.concat(<any>i),e);
        });

        return translation ;
    }

    /**
     * Translate to the current language
     * If not found translate to default language
     * if not return key
     *
     * @param key string
     * @return string
     */
    private translate(key : string) : string {
        let translation = key ;

        // found in current language
        if(this._translations[this._currentLang] && this._translations[this._currentLang][key]){
            return this._translations[this._currentLang][key];
        }

        // found in default language
        if(this._translations[this._defaultLang] && this._translations[this._defaultLang][key]){
            return this._translations[this._defaultLang][key];
        }

        // not found, so return key
        return translation ;

    }

    /**
     * Translate to the current langu
     *
     * @param key
     * @param words
     * @return string
     */
    public instant(key: string , words ?: string | string[]) : string {

        const translation : string = this.translate(key);

        if(!words )
            return translation ;

        return this.replace(translation, words);
    }

}