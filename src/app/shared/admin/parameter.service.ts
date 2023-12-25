import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class ParameterService  {

  constructor(public http: HttpClient) {
  }


  find(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/parameters/find', HD.toGetOptions(query));
  }

  searchByParentCodeAndCodes(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/parameters/search_by_parent_code_and_codes', HD.toGetOptions(query));
  }

  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/parameters/search', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/parameters/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/parameters/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/parameters/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/parameters/remove/" + form.id, HD.toDeleteOptions({}));
  }

}

