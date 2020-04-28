import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../service/AppConfig.service';
export class CustomLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) {
    // console.log(this.appConfigService.config);
  }
  public getTranslation(lang: String): Observable<any> {
    // console.log(this.appConfigService.config['base_url'] + `?action=get_lang_dictionary`)
    // return this.http.post(this.appConfigService.config['base_url'] + `?action=get_lang_dictionary`, { "lang_id": 1 })
    //   .pipe(
    //     map((res) => {
    //       console.log(res);
    //       return res;
    //     })
    //   );
    //return this.http.get(`http://<someurlreferences>?language=${lang}`)
    return this.http.get(`https://api.mlab.com/api/1/databases/staff/collections/${lang}?apiKey=lXutACAwSvbZ_lgydrHKTyJA4duiL-iH`)
      .pipe(
        map((response) => {
          return response[0];
        })
      );
  }
}