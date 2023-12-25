import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {R, U} from "../../../../../starter/utils/utils";
import {Observable} from "rxjs";
import {LoginService} from "../../../../../shared/admin/login.service";
import {AutoScriptService} from "../../../../../shared/auto-script.service";
import {Convert} from "../../../../../starter/utils/convert";
import {environment} from "../../../../../../environments/environment";
import {Stomp} from "@stomp/stompjs";
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import {RobotScriptService} from "../../../../../shared/robot-script.service";

@Component({
  selector: 'app-auto-dataset',
  templateUrl: './auto-dataset.component.html',
  styleUrls: ['./auto-dataset.component.scss']
})
export class AutoDatasetComponent implements OnInit, OnDestroy {
  @Output() callbackTestResultEvent = new EventEmitter();
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

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private loginService: LoginService,
              private robotScriptService : RobotScriptService) {

  }

  ngOnInit(): void {
    this.startWebsocket();
  }

  openViewAction(obj: any): void {
    this.currentDataset = obj;
  }

  closeViewAction(): void {
    this.closeEvent.emit();
  }

  aiTestAction(): void {
    this.nzModalBtnVisible = true;
    this.messages = [];
    const observable: Observable<R> = this.robotScriptService.robotAction(this.currentDataset.id);
    observable.subscribe((data) => {
      this.nzModalBtnVisible = false;
      if (R.isSuccess(data)) {
        this.messages = [...this.messages, data.t];
      }
    });
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
            this.messages = [...this.messages, message.body]
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
