import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {HD} from "../starter/utils/utils";
import {query} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class AutoScriptService  {

  constructor(public http: HttpClient) {
  }

  resetAction(): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/reset', {});
  }

  testCodeAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/test_code/'+id, HD.toGetOptions(query));
  }

  startRunAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/test_code/'+id, HD.toGetOptions(query));
  }


  packDocxAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/pack_docx/'+id, HD.toGetOptions(query));
  }

  packGuideAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/pack_guide/'+id, HD.toGetOptions(query));
  }

  packXmindAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/pack_xmind/'+id, HD.toGetOptions(query));
  }

  packAllAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/auto_copyright_script/pack_all/'+id, HD.toGetOptions(query));
  }
}

