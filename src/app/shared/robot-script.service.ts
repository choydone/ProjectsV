import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {HD} from "../starter/utils/utils";
import {query} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class RobotScriptService  {

  constructor(public http: HttpClient) {
  }

  conversation(form: any): Observable<any> {
    return this.http.post('/openapi/api/v1/robot/conversation/'+form.type, HD.toPostOptions(form));
  }

  robotAction(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/robot/ai/'+id, HD.toGetOptions({}));
  }

}

