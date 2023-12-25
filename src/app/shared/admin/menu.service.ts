import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(public http: HttpClient) {
  }

  getById(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/menus/get_by_id/' + id, HD.toGetOptions({}));
  }

  searchAtTree(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/menus/search_at_tree', HD.toGetOptions(query));
  }

  searchAtPageAndTree(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/menus/search_at_page_and_tree', HD.toGetOptions(query));
  }

  removeAction(id: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/menus/remove/" + id);
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/menus/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/menus/save/" + form.id, HD.toPutOptions(form));
    }

  }
}

