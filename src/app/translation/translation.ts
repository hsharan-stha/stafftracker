// import dI
import { InjectionToken } from '@angular/core';

// import translations
import { LANG_EN_NAME , LANG_EN_TRANS  } from './lang-en';
import { LANG_RU_NAME , LANG_RU_TRANS  } from './lang-ru';

// translation token
export const TRANSLATIONS = new InjectionToken<string>('translations');
// all translations
export const dictionary = {
    [LANG_EN_NAME] : LANG_EN_TRANS ,
    [LANG_RU_NAME] : LANG_RU_TRANS
};

export const TRANSLATION_PROVIDERS = [
    {
        provide : TRANSLATIONS ,
        useValue : dictionary
    },
];