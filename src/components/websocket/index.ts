interface YWebSocketOpt {
  pingTimeout?: number;
  pongTimeout?: number;
  reconnectTimeout?: number;
  pingMsg?: string;
  repeatLimit?: number;
}
const defaultOpt: YWebSocketOpt = {
  pingTimeout: 15000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: '{type:"ping"}',
  repeatLimit: 1,
};
export default class YWebSocket {
  url: string;
  protocols?: string;
  ws: WebSocket;
  opt: YWebSocketOpt;

  lockReconnect = false;
  isClose = false;

  repeatTimes = 0;
  pingTimeoutId: number;
  pongTimeoutId: number;

  needHeart = false;

  constructor(url: string, protocols?: string, opt: YWebSocketOpt = defaultOpt) {
    this.url = url;
    this.protocols = protocols;
    this.opt = opt;
  }

  init() {
    this.createWebSocket();
    this.initEventHandle();
  }

  createWebSocket() {
    try {
      this.ws = new WebSocket(this.url, this.protocols);
    } catch (e) {
      this.reconnect();
      console.error(e);
    }
  }

  initEventHandle() {
    this.ws.onclose = (e) => {
      this.onclose(e);
      this.reconnect();
    };
    this.ws.onerror = (e) => {
      this.onerror(e);
      this.reconnect();
    };
    this.ws.onopen = (e) => {
      this.repeatTimes = 0;
      this.onopen(e);
      // 心跳检测重置
      this.heartCheck();
    };
    this.ws.onmessage = (e) => {
      this.onmessage(e);
      // 如果获取到消息，心跳检测重置
      // 拿到任何消息都说明当前连接是正常的
      this.heartCheck();
    };
  }

  reconnect() {
    if (!this.opt.repeatLimit) {
      return;
    }
    if (this.repeatTimes > this.opt.repeatLimit) {
      return;
    }
    if (this.lockReconnect || this.isClose) return;
    this.lockReconnect = true;
    this.repeatTimes++;
    this.onreconnect();
    window.setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, this.opt.reconnectTimeout);
  }

  heartCheck() {
    if (!this.needHeart) return;
    this.heartReset();
    this.heartStart();
  }
  heartStart() {
    if (this.isClose) return;
    this.pingTimeoutId = window.setTimeout(() => {
      this.ws.send(this.opt.pingMsg || '{type:"ping"}');
      this.pongTimeoutId = window.setTimeout(() => {
        this.ws.close();
      }, this.opt.pongTimeout);
    }, this.opt.pingTimeout);
  }
  heartReset() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  }
  close() {
    this.isClose = true;
    this.heartReset();
    this.ws.close();
  }
  // extends websocket
  send(msg) {
    this.ws.send(msg);
  }
  onclose(e) {}
  onerror(e) {}
  onopen(e) {}
  onmessage(e) {}
  onreconnect() {}
}
