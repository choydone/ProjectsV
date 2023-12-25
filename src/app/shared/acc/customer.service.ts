import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(public http: HttpClient) {
  }

  searchProfile(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/customer/search_profile', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/customer/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/customer/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/customer/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/customer/remove/" + form.id, HD.toDeleteOptions(form));
  }

}

