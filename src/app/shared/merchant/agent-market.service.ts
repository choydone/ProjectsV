import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class AgentMarketService   {

  constructor(public http: HttpClient) {
  }

  find(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/agent_market/find_by_product_id_and_agent_id', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/agent_market/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/agent_market/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/agent_market/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(id: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/agent_market/remove/" + id, HD.toDeleteOptions({}));
  }


}

