import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class OrdersCopyrightService   {

  constructor(public http: HttpClient) {
  }

  getById(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders_copyright/get_by_id/' + id);
  }

  calcStatusByOrdersId(ordersId: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders_copyright/calc_status_by_orders_id/' + ordersId);
  }

  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders_copyright/search', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders_copyright/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/orders_copyright/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/orders_copyright/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/orders_copyright/remove/" + form.id, HD.toDeleteOptions(form));
  }

  cancelableAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_copyright/cancelable/" + form.id, HD.toPostOptions(form));
  }

  resetCodeAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_copyright/code_reset/" + form.id, HD.toPostOptions(form));
  }
  changeNameAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_copyright/change_name/" + form.id, HD.toPostOptions(form));
  }

  exportAction(query: any): Observable<any> {
    return this.http.post('/openapi/api/v1/orders_copyright/export', HD.toPostOptions(query));
  }

}

