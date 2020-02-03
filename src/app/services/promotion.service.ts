import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable, of } from 'rxjs';
import { delay,map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http:HttpClient) { }
  getPrmotions():Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions');
  }
  getPromotion(id:string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promo/' + id);  

  }
  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promo?featured=true').pipe(map(promo => promo[0]));

  }
}
