import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {R} from "../../../../starter/utils/utils";
import {LoginService} from "../../../../shared/admin/login.service";
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import {Stomp} from "@stomp/stompjs";
import {AutoScriptService} from "../../../../shared/auto-script.service";
import {Convert} from "../../../../starter/utils/convert";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-copyright-auto-docx',
  templateUrl: './copyright-auto-docx.component.html',
  styleUrls: ['./copyright-auto-docx.component.scss']
})
export class CopyrightAutoDocxComponent implements OnInit, OnDestroy {
  @Output() closeEvent = new EventEmitter<void>();

  currentDataset: any = {};
  nzModalVisible = true
  nzModalBtnVisible = false;


  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messages: string[] = [];
  stompClient!: any;
  retryCount = 0;
  maxRetryCount = 5;
  retryInterval = 3000;
  docxList: any[] = []
  docxNames: any[] = ["项目网址", "项目地址", "软件逻辑图地址", "使用说明书地址", "源代码文档地址", "完整文档地址"]


  // 模拟软件是否运行中
  isRun = false;

  //当前任务的值

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private loginService: LoginService,
              private autoScriptService: AutoScriptService) {

  }

  ngOnInit(): void {

    this.startWebsocket();
  }


  openViewAction(obj: any): void {
    this.currentDataset = obj;
    this.isRun = false;
  }


  closeViewAction(): void {
    this.closeEvent.emit();
  }

  startRunAction(): void {
    this.nzModalBtnVisible = true;
    this.isRun = false;
    this.messages = [];
    this.docxList = [];
    const observable: Observable<R> = this.autoScriptService.startRunAction(this.currentDataset.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
  }

  startPackCodeDocxAction(): void {
    this.messages = [];
    this.nzModalBtnVisible = true;
    const observable: Observable<R> = this.autoScriptService.packDocxAction(this.currentDataset.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
  }

  startPackGuideDocxAction(): void {
    this.messages = [];
    this.nzModalBtnVisible = true;
    const observable: Observable<R> = this.autoScriptService.packGuideAction(this.currentDataset.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
  }

  startPackXmindAction(): void {
    this.messages = [];
    this.nzModalBtnVisible = true;
    const observable: Observable<R> = this.autoScriptService.packXmindAction(this.currentDataset.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
  }

  startPackAllAction(): void {
    this.messages = [];
    this.nzModalBtnVisible = true;
    const observable: Observable<R> = this.autoScriptService.packAllAction(this.currentDataset.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
  }

  downloadAction(text: any): void {
    const name = Convert.extractContentBetweenMarkers(text, "【", "】");
    const docxPath: any = Convert.getLastSubstringAfterDelimiter(text, "】");
    if (name == '项目地址') {
      window.open("/openapi/api/v1/auto_copyright_script/download_zip/?path=" + docxPath + "&cnName=" + this.currentDataset.name + "-项目", '_blank');
    } else if (name == '软件逻辑图地址') {
      window.open("/openapi/api/v1/auto_copyright_script/download_xmind?path=" + docxPath + "&cnName=" + this.currentDataset.name + "-逻辑思维图", '_blank');
    } else if (name == '完整文档地址') {
      window.open("/openapi/api/v1/auto_copyright_script/download_package?paths=" + docxPath + "&cnName=" + this.currentDataset.name + "-软著整个包", '_blank');
    } else if (name == '使用说明书地址') {
      window.open("/openapi/api/v1/auto_copyright_script/download_docx/?path=" + docxPath + "&cnName=" + this.currentDataset.name + "-使用说明书", '_blank');
    } else if (name == '源代码文档地址') {
      window.open("/openapi/api/v1/auto_copyright_script/download_docx/?path=" + docxPath + "&cnName=" + this.currentDataset.name + "-源代码", '_blank');
    }
  }

  openWebsite(path: string): void {
    if (path.includes("项目网址")) {
      const website: any = Convert.getLastSubstringAfterDelimiter(path, "】");
      window.open(website, '_blank');
    }
  }

  /* 消息 */
  startWebsocket(): void {
    const observable: Observable<R> = this.loginService.getPrincipal();
    observable.subscribe((data) => {
      if (!R.isSuccess(data)) {
        return;
      }
      const user: any = data.t;
      // 创建 WebSocket 工厂对象
      const wsFactory = () => {
        return new SockJS(environment.websocket + '/openapi/web-terminal');
      };

      // const socket = new SockJS('/support/web-terminal'); //后台配置文件里面配置的注册信息
      this.stompClient = Stomp.over(wsFactory);//2
      //日志不打印
      this.stompClient.debug = () => {
      };
      let connect = () => {
        this.stompClient.connect({}, (frame: any) => {//3
          console.log('开始进行连接Connected: ' + frame);
          this.messages = [...this.messages, "开始进行连接Connected：" + frame]
          //监听
          this.stompClient.subscribe('/userTest/U_' + user.id + "_" + this.currentDataset.id + "/info", (message: any) => {
            const atLeastOneExists = this.docxNames.some((substring: any) => message.body.includes(substring));
            if (atLeastOneExists) {
              const type = Convert.extractContentBetweenMarkers(message.body, "【", "】");
              this.docxList = this.docxList.filter(d => d.type !== type);
              this.docxList = [...this.docxList, {
                text: message.body,
                date: new Date(),
                type: type
              }];
            }

            this.messages = [...this.messages, message.body]
            if (message.body.includes("【Success】")) { // 表示测试成功,字符串不能修改
              this.nzModalBtnVisible = false;
              this.isRun = true;
              let website: any = "";
              this.docxList.forEach((x) => {
                if (x.text.includes("项目网址")) {
                  website = x.text;
                }
              })
              this.openWebsite(website);
            }
            if (message.body.includes("【Error】")||message.body.includes("【文档打包成功】")||message.body.includes("【文档打包失败】")) { // 表示测失败,字符串不能修改
              this.nzModalBtnVisible = false;
            }
            if (this.messageContainer) {
              const element = this.messageContainer.nativeElement;
              element.scrollTop = element.scrollHeight - element.clientHeight + 220;
            }
          });
        }, (err: any) => {
          // 连接发生错误时的处理函数
          console.log(err);
          this.message.error("连接发生错误，请刷新网页再次连接");
          this.messages = [...this.messages, "连接服务器发生错误，请关闭后重新开发"]
        });
      }

      // 监听 SockJS 的 close 事件
      this.stompClient.onclose = (closeEvent: any) => {
        console.log('SockJS connection closed:', closeEvent);
        this.messages = [...this.messages, "Websocket 连接关闭..."]
        // 判断关闭原因
        if (closeEvent.code === 1000) {
          console.log('Normal closure, no errors detected.');
        } else {
          console.log('Connection lost unexpectedly:', closeEvent.reason);

          // 判断重试次数
          if (this.retryCount < this.maxRetryCount) {
            // 重连
            console.log('Reconnecting in', this.retryInterval, 'milliseconds...');
            this.messages = [...this.messages, this.retryInterval + "毫秒后，重新连接..."]
            this.retryCount++;
            setTimeout(connect, this.retryInterval);
          } else {
            console.log('Max retry count reached, giving up...');
            this.messages = [...this.messages, "超出最大连接次数，停止连接，如需要请关闭窗口后重新打开！"]
          }
        }
      };
      connect();
    })
  }

  checkMessage(str: any): any {
    if (str.includes("【Success】")) {
      return {
        'green': true
      };
    }
    if (str.includes("【Error】")) {
      return {
        'red': true
      };
    }
    if (str.includes("【Debug】")) {
      return {
        'gray': true
      };
    }
    if (str.includes("【网址】")) {
      return {
        'green': true
      };
    }

    if (str.includes("【有点问题】")) {
      return {
        'red': true
      };
    }
    if (str.includes("【文档打包失败】")) {
      return {
        'red': true
      };
    }
  }

  ngOnDestroy() {
    if (this.stompClient) {
      try {
        this.stompClient.unsubscribe();
      } catch (e) {
      }
    }
    // 断开链接
    if (this.stompClient) {
      try {
        this.stompClient.disconnect();
      } catch (e) {
      }
    }
    // 实例关闭
    if (this.stompClient) {
      try {
        this.stompClient.close();
      } catch (e) {
      }
    }
  }
}
