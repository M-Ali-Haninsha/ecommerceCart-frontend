import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private baseUrl = 'http://localhost:3000/'

  constructor(private http:HttpClient) { }

  getProducts():Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getProducts') 
  }

  userSignup(data:FormData): Observable<FormData> {
    return this.http.post<FormData>(this.baseUrl + 'userSignup', data)
  }

  userLogin(data:FormData): Observable<FormData> {
    return this.http.post<FormData>(this.baseUrl + 'userLogin', data)
  }


  addToCart(productId: string, headers: HttpHeaders): Observable<any> {
    const url = this.baseUrl + 'addToCart';
    
    const options = { headers };
    
    return this.http.post<any>(url, { productId }, options);
  }

  localStorageProducts(productDat: any): Observable<any> {
    const url = `${this.baseUrl}getLocalStorageProduct`;
    const params = new HttpParams().set('product', JSON.stringify(productDat));
    return this.http.get<any>(url, { params });
  }

  getCartItems(headers: HttpHeaders): Observable<any> {
    const url = this.baseUrl + 'getCartItems';
    const options = { headers };
    return this.http.get<any>(url, options);
  }

  getCartItemIfLocalData(headers:HttpHeaders, productData:any):Observable<any> {
    const url = `${this.baseUrl}getCartItemIfLocalData`;
    const options = {
      headers: headers,
      params: new HttpParams().set('product', JSON.stringify(productData))
    };
    return this.http.get<any>(url, options);
  }

  cartLogic(proId:string, value: string, currentQuantity:Number, headers:HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}incrementOrDecrement`;
    const options = { headers };
    return this.http.post<any>(url, {proId, value, currentQuantity}, options)
  }

  cartLogicDecrement(productId:string, currentQuantity:Number, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}incrementOrDecrement`;
    const options = { headers };
    return this.http.post<any>(url, {productId, currentQuantity}, options)
  }

  removeCartItem(productId:string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}removeCartItem`;
    const options = { headers };
    return this.http.post<any>(url, {productId}, options)
  }
}
