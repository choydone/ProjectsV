import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD} from "../utils/utils";

@Injectable({
  providedIn: 'root'
})
export class EnumsService  {

  constructor(public http: HttpClient) {
  }

  search(cls: any): Observable<any> {
    return this.http.get('/openapi/api/v1/enums/search', HD.toGetOptions({cls: cls}));
  }

}

