import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nTranslateService {

  constructor(public translateService: TranslateService) { }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }

}
