import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {HD} from "../utils/utils";


@Injectable({
  providedIn: 'root'
})
export class IconService  {

  constructor(public http: HttpClient) {

  }

  getByCode(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/icons/get_by_code', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/icons/search_at_page', HD.toGetOptions(query));
  }



}
