import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {LoginService} from "../../shared/admin/login.service";
import {SecurityService} from "../../starter/shared/security-service";
import {AppReuseStrategy} from "../../app-reuse-strategy";
import {R, U} from "../../starter/utils/utils";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;

  env = environment

  constructor(private router: Router, private securityService: SecurityService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.searchPrincipalMenus();
  }

  searchPrincipalMenus() {
    const observable: Observable<R> = this.loginService.searchResourceByPrincipal();
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.securityService.menus = data.t.menuTree;
        this.securityService.savePermissions(data.t.permissionCodes);
      }
    });
  }

  /**
   * 点击菜单缩放
   */
  collapsedEvent(event: any): void {
    this.isCollapsed = event;
  }

  /**
   * 点击菜单操作
   */
  clickMenuLink(menu: any) {
    let bool = false;
    // 判断nav 是否存在，如果存在则激活，
    for (const i in this.securityService.navs) {
      this.securityService.navs[i].active = false;
      if (this.securityService.navs[i].id === menu.id) {
        this.securityService.navs[i].active = true;
        bool = true;
      }
    }

    // 如果navs 不存在则添加新的nav。同时激活
    if (!bool) {
      menu.active = true;
      this.securityService.navs = [...this.securityService.navs, menu];
    }

    // 地址
    menu.path = U.StringUtils.isNotBank(menu.routePath) ? menu.routePath : '/default/blank_page/' + this.securityService.getBlankPageCount();
    // 打开页面
    this.router.navigateByUrl(menu.routePath, menu.queryParams !== '' ? menu.queryParams : {});

  }

  /**
   * 点击navs栏时候显示
   */
  showNav(nav: any): void {
    this.securityService.navs.forEach((data) => {
      data.active = false;
    });
    nav.active = true;
    nav.path = U.StringUtils.isNotBank(nav.path) ? nav.path : '/default/blank_page/' + this.securityService.getBlankPageCount();
    this.router.navigateByUrl(nav.path, nav.queryParams !== '' ? nav.queryParams : {})
  }

  /**
   * 关闭navs栏
   */
  closeNav(nav: any): void {
    this.securityService.navs = this.securityService.navs.filter(d => d.id !== nav.id);
    if (nav.active) {
      const _nav = this.securityService.navs[this.securityService.navs.length - 1];
      _nav.active = true;
      this.router.navigateByUrl(_nav.path, _nav.queryParams !== '' ? _nav.queryParams : {}).then(x => {
        console.log("清除复用路由")
        AppReuseStrategy.deleteRouteSnapshot(nav.path);
      });
    } else {
      console.log("清除复用路由")
      AppReuseStrategy.deleteRouteSnapshot(nav.path);
    }
  }


  refreshAction(): void {
    window.location.href = "/";
  }

  findNavs(): any[] {
    return this.securityService.navs;
  }

  searchMenus(): any[] {
    return this.securityService.menus;
  }

}
