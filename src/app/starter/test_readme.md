### 微服务单独运行 -- 生产环境需要取消

#### 登陆配置 - 用于获取用户登陆

###### 1、app-routing.module.ts 文件 添加如下配置
~~~
const routes: Routes = [
  {path: 'login', loadChildren: () => import('./starter/pages/login/login.module').then(m => m.LoginModule)}
];
~~~

###### 2、app.module.ts 文件 添加如下配置  拦截请求
~~~
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHook,
      multi: true,
    }],   
~~~
