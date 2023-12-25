import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD} from "../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class AliyunService {

  constructor(public http: HttpClient) {
  }


  ossPolicyAction(query: any): Observable<any> {
    return this.http.get("/support/api/v1/aliyun/oss/policy", HD.toGetOptions(query));
  }

  ocrBusinessLicenseAction(form: any): Observable<any> {
    form.url = form.url.replace(/.pdf/gi, ".jpg");
    return this.http.post("/support/api/v1/aliyun/ocr/business_license", HD.toPostOptions(form));
  }

  ocrCcopyrightLicenseAction(form: any): Observable<any> {
    form.url = form.url.replace(/.pdf/gi, ".jpg");
    return this.http.post("/support/api/v1/aliyun/ocr/ccopyright_license", HD.toPostOptions(form));
  }

  ocrPatentLicenseAction(form: any): Observable<any> {
    form.url = form.url.replace(/.pdf/gi, ".jpg");
    return this.http.post("/support/api/v1/aliyun/ocr/patent_license", HD.toPostOptions(form));
  }
}

