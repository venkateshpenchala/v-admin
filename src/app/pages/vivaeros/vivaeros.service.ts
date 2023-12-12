import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({   providedIn: 'root' })
export class VivaerosService {
  public static url = 'https://hogkdf0qsh.execute-api.us-east-1.amazonaws.com/default/getBillbee';
  public static googleUrl = 'http://googlelb-1211007039.us-east-1.elb.amazonaws.com/api/ga4-data';

  constructor(private http: HttpClient) {}

  getOrderData(start:string, end: string, page:number) {
    return this.get(start, end, page);
  }

  async get(start: string, end: string, page: number) {
    return this.http.get(VivaerosService.url+'?minOrderDate='+start+'&maxOrderDate='+end+'&page='+page);
  }

  async getCountries() {
    return this.http.get(VivaerosService.googleUrl+'?startDate=7daysAgo&endDate=today&dimensions=country');
  }

  async getDeviceCategories() {
    return this.http.get(VivaerosService.googleUrl+'?startDate=7daysAgo&endDate=today&dimensions=deviceCategory');
  }
}
