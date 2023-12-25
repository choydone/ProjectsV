import { Injectable } from "@angular/core";
import {U} from "../utils/utils";


@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  // 空白单元计数
  blankPageCount = 0;

  // 左侧菜单
  menus: any[] = [];

  // 菜单nav栏
  navs: any[] = [];

  permissionsSet: Set<String> = new Set<String>();

  getBlankPageCount() {
    this.blankPageCount = this.blankPageCount + 1;
    return this.blankPageCount;
  }

  /**
   * 点击菜单操作
   */
  routerLink(linkWay: any, router: any) {
    let menu: any = {};
    this.menus.forEach((m) => {
      if (U.CollectionUtils.isNotEmpty(m.children)) {
        // @ts-ignore
        m.children.forEach((c) => {
          if (c.routePath == linkWay) {
            menu = c;
          }
        })
      } else {
        if (m.routePath == linkWay) {
          menu = m;
        }
      }
    })

    let bool = false;
    // 判断nav 是否存在，如果存在则激活，
    for (const i in this.navs) {
      this.navs[i].active = false;
      if (this.navs[i].id === menu.id) {
        this.navs[i].active = true;
        bool = true;
      }
    }

    // 如果navs 不存在则添加新的nav。同时激活
    if (!bool) {
      menu.active = true;
      this.navs = [...this.navs, menu];
    }

    menu.path = U.StringUtils.isNotBank(menu.routePath) ? menu.routePath : '/default/blank_page/' + this.getBlankPageCount();
    // 打开页面
    router.navigateByUrl(menu.routePath, menu.queryParams !== '' ? menu.queryParams : {});
  }


  /**
   * 保存授权信息
   */
  savePermissions(permissions: any[]): void {
    this.permissionsSet.clear();
    permissions.forEach((permission) => {
      this.permissionsSet.add(permission);
    })
  }

  /**
   * 权限严重
   * @param key
   */
  checkPermission(key: string): boolean {
    return this.permissionsSet.has(key);
  }

}
