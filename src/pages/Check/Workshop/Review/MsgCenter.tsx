import { useEffect } from 'react';
import { useCreation, useEventEmitter } from 'ahooks';

import Process from './Process';

import store from '@/store';

import YWebSocket from '@/components/websocket';
import UserList, { UserItem } from './socketClass/user';

import type { CompMsgType } from './msg.d';
import { YTree } from '@/pages/Struct/Construct/Tree/node';

export type { CompMsgType };
export interface MsgDataType {
  yTree: YTree;
  userList: UserList;
  recordList: [];
  user: UserItem;
}

// 中转站接受服务端消息并转换成组件内部消息通知
const url = `ws://${window.location.host}/api/websocket/product/category?domainId=1001`;

// style的资源会浪费，所以在最外层维护,如果不定义则用全局的style维护
const style = document.createElement('style');
style.type = 'text/css';

export default function Stand() {
  const [user] = store.useModel('user');

  const stepMsg$ = useEventEmitter<CompMsgType>();
  // 只在第三步的时候需要用到
  const msgData = useCreation<MsgDataType>(
    () => ({
      yTree: new YTree([], [], {
        userId: user.userId,
        style,
      }),
      userList: new UserList(),
      recordList: [],
      user: {} as any,
    }),
    [],
  );
  const ws = useCreation(() => new YWebSocket(url, user.userId), []);

  useEffect(() => {
    // const ws = new YWebSocket(url);
    // msgData.userList.init()
    ws.init();
    ws.onmessage = ({ data }) => {
      console.log('ws');
    };
    ws.onclose = () => {
      // yTree.onDestory();
    };
    return () => {
      ws.close?.();
    };
  }, []);

  stepMsg$.useSubscription((msg) => {});

  return <Process stepMsg$={stepMsg$} msgData={msgData} />;
}
