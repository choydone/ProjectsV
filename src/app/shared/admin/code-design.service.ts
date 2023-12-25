import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class CodeDesignService {

  constructor(public http: HttpClient) {
  }

  searchByCode(code: any): Observable<any> {
    return this.http.get('/openapi/api/v1/code_design/search_by_code', HD.toGetOptions({code: code}));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/code_design/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/code_design/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/code_design/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/code_design/remove/" + form.id, HD.toDeleteOptions(form));
  }

}

