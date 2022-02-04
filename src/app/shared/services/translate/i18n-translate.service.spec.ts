import { TestBed } from '@angular/core/testing';

import { I18nTranslateService } from './i18n-translate.service';

describe('I18nTranslateService', () => {
  let service: I18nTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
