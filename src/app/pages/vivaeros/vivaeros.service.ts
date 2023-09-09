import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({   providedIn: 'root' })
export class VivaerosService {
  public static url = 'http://localhost:8080/https://app.billbee.io';

  constructor(private http: HttpClient) {}

  getOrderData(start:string, end: string, page:number) {
    return this.get(start, end, page);
  }

  async get(start: string, end: string, page: number) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa('g.lenssen@vivaeros.com:MLVXeTebUx5DaX3'),
      'Access-Conttrol-Allow-Origin': '*',
      Accept: 'application/json',
      'X-Billbee-Api-Key': '204B947D-8646-46E7-A8CF-BFEBCB3CAEAB'
    });

    return this.http.get(VivaerosService.url+'/api/v1/orders?minOrderDate='+start+'&maxOrderDate='+end+'&page='+page, {
      headers: headers
    });
  }

}
