import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SecurityService} from "./security-service";
import {L, R, U} from "../utils/utils";

@Injectable()
export class HttpHook implements HttpInterceptor {

  constructor(private router: Router, private securityService: SecurityService, private message: NzMessageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const accessToken = this.securityService.getAccessToken();
    // if (accessToken && request.url.indexOf("/cloud/oauth/token") == -1) {
    //     console.log(request)
    //     request = request.clone({
    //         setHeaders: {
    //             Authorization: `Bearer ` + accessToken
    //         }
    //     });
    // }

    /**
     * continues request execution
     */
    return next.handle(request).pipe(
      map(data => {
        if (data instanceof HttpResponse) {
          if (data.url && data.url.search('assets') > -1) {
            return data;
          }

          if (data.url && data.url.search('oss-cn-beijing.aliyuncs.com') > -1) {
            return data;
          }

          const body: R = data.body;
          if (body.code === R.RESULT_STATUS.SUCCESS) {
            return data;
          }

          if (body.code === R.RESULT_STATUS.SESSION_EXPIRY || body.code === R.RESULT_STATUS.UNAUTHENTICATED) {
            // window.location.href = '/login';
            L.info("Session 已过期，请重新登录");
            this.router.navigate(['/login']);
            return data;
          }

          if (body.code === R.RESULT_STATUS.PARAMETER_ERROR) {
            let text = "[" + body.message.description + "]:";
            let errors: Array<any> = body.t;
            errors.forEach((err) => {
              text += err.defaultMessage;
            })
            this.message.warning(text);
            return data;
          }
          let text = U.StringUtils.isNotBank(body.message.description) ? body.message.description : "";
          text = U.StringUtils.isNotBank(body.t) ? "[" + text + "]：" + body.t : text;
          this.message.warning(text);
          return data;
        }
        return data;
      }),
      catchError((error, caught) => {
        L.error(error);
        const result: R = this.getServerErrorResult();
        this.message.error('服务异常！请联系管理员！');
        return of(result);
      }) as any);
  }

  /**
   * 网络服务异常
   */
  getServerErrorResult(): R {
    let result: R = new R();
    result.code = "504";
    result.message ={description:'服务异常，请重试！'}
    return result;
  }
}
