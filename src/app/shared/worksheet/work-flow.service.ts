import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class WorkFlowService {

  constructor(public http: HttpClient) {

  }


  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/work_flow/search', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/work_flow/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/work_flow/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/work_flow/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/work_flow/remove/" + form.id, HD.toDeleteOptions({}));
  }

}

