import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class CopyrightService {

  constructor(public http: HttpClient) {
  }

  getById(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/copyright/get_by_id/' + id);
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/copyright/search_at_page', HD.toGetOptions(query));
  }


  acceptedAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/accepted/" + form.id, HD.toPostOptions({}));
  }

  processedAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/processed/" + form.id, HD.toPostOptions(form));
  }

  preDeclaredAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/pre_declared/" + form.id, HD.toPostOptions({}));
  }

  declaredAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/declared/" + form.id, HD.toPostOptions(form));
  }

  updateCopyrightStatusAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/update_copyright_status/" + form.id, HD.toPostOptions(form));
  }

  doneAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/done/" + form.id, HD.toPostOptions(form));
  }

  updateCodeupAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/copyright/update_codeup/" + form.id, HD.toPostOptions(form));
  }

  generateFaviconAction(query: any): Observable<any> {
    return this.http.get("/openapi/api/v1/copyright/generate_favicon", HD.toGetOptions(query));
  }


}

