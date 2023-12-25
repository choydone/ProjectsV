import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(public http: HttpClient) {
  }

  searchAtTree(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/document/search_at_tree', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/document/search_at_page', HD.toGetOptions(query));
  }

  saveNodeAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/document/save_node", HD.toPostOptions(form));
    } else {
      return this.http.post("/openapi/api/v1/document/save_node", HD.toPostOptions(form));
    }
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/document/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/document/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeNodeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/document/remove_node", HD.toDeleteOptions(form));
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/document/remove/" + form.id, HD.toDeleteOptions(form));
  }

}

