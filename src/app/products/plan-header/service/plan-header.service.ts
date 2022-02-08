import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AppConfig } from '@app-root/app-config'
import { map, Observable } from 'rxjs'

interface IProduct {
  productId: string
  productName: string
}
@Injectable({
  providedIn: 'root',
})
export class PlanHeaderService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getProduct(): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.appConfig.BASE_URL}/api/product`)
  }
}
