import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AppConfig } from '@app-root/app-config'
import { map, Observable } from 'rxjs'
import { IProductPlanHeader } from '../interface/TPD'

@Injectable({
  providedIn: 'root',
})
export class PlanHeaderService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getProduct(): Observable<IProductPlanHeader.IPlanHeaderItem> {
    return this.http.get(`${this.appConfig.BASE_URL}/api/product`)
  }
}
