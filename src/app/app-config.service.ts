import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'

@Injectable()
export class AppConfigService {
  public readonly APP_NAME = 'LIS'
  public readonly APP_FULL_NAME = 'Life Insurance System'
  public readonly APP_VERSION = '1.0.0'
  public readonly BASE_URL = environment.baseURL
}
