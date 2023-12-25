import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle, Route} from '@angular/router';

export class AppReuseStrategy implements RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {};


  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断，这里判断是否有data数据判断是否复用 */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // 若是全缓存可去掉此分支
    // @ts-ignore
    if (route.data.keepLive) {
      return true;
    }
    return false;
  }


  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    AppReuseStrategy.handlers[this.getPath(route)] = handle;
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!AppReuseStrategy.handlers[this.getPath(route)] && !!route.component;
  }


  /** 从缓存中获取快照，若无则返回nul */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.component) return null;
    if (!AppReuseStrategy.handlers[this.getPath(route)]) {
      return null;
    }
    return AppReuseStrategy.handlers[this.getPath(route)];
  }

  /** 进入路由触发，判断是否是同一路由 */

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // 解决不同路由间的错误问题
    // @ts-ignore
    if (future.routeConfig && curr.routeConfig && future.routeConfig.data && future.routeConfig.data.routeKeep) {
      return true;
    }
    return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
  }


  private getPath(route: any): string {
    // tslint:disable-next-line: no-string-literal
    const path = route['_routerState'].url.replace(/\//g, '_');
    return path;
  }

  // 清除单个路由缓存
  public static deleteRouteSnapshot(path: string): void {
    const name = path.replace(/\//g, '_');
    if (AppReuseStrategy.handlers[name]) {
      delete AppReuseStrategy.handlers[name];
    }
  }

  // 清除全部路由缓存
  clear(): void {
    // tslint:disable-next-line:forin
    for (const key in AppReuseStrategy.handlers) {
      delete AppReuseStrategy.handlers[key];
    }
  }
}
