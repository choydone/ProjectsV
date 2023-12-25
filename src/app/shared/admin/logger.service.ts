import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HD} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class LoggerService  {

  constructor(public http: HttpClient) {

  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/logger/search_at_page', HD.toGetOptions(query));
  }

}
