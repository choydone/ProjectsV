import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class IniService {

  constructor(public http: HttpClient) {
  }


  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/ini_file/search', HD.toGetOptions(query));
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete('/openapi/api/v1/ini_file/remove_ini_key', HD.toDeleteOptions(form));
  }

  saveAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/ini_file/add_or_update_ini_key", HD.toPostOptions(form));

  }


}
