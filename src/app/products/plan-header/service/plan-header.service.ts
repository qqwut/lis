import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AppConfigService } from '@app-root/app-config.service'
import { map, Observable } from 'rxjs'

interface IProduct {
  productId: string
  productName: string
}
@Injectable({
  providedIn: 'root',
})
export class PlanHeaderService {
  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getProduct(): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.appConfig.BASE_URL}/api/product`)
  }
}
