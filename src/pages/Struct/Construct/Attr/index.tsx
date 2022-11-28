import { useEffect } from 'react';
import { useCreation, useEventEmitter } from 'ahooks';

import Panel from '../Panel';
import RND from '../RND';
import Table from './Table';
import Header from './Header';
import Tool from './Tool';

import store from '@/store';

import { YTree } from '../Tree/node';
import YWebSocket from '../../../../components/websocket';

import type { MsgType, SocketMsgType } from '../msg.d';
import TrashAttr from './TrashAttr';
import History from '../History';
import { AppstoreOutlined, DeleteOutlined, FileTextOutlined, LeftOutlined } from '@ant-design/icons';

import styles from './index.module.less';

const url = `ws://${window.location.host}/api/websocket/product/feature?domainId=1001`;

const style = document.createElement('style');
style.type = 'text/css';

export default function Content({ id, back }) {
  const [user] = store.useModel('user');

  const attrMsg$ = useEventEmitter<MsgType>();
  const yAttr = useCreation(
    () =>
      new YTree([], [], {
        userId: user.userId,
        style,
        prefix: 'attrLoc',
        updateKeys: ['name', 'dataType', 'unit', 'value'],
        reverseOrder: true,
      }),
    [],
  );
  const ws = useCreation(() => new YWebSocket(`${url}&categoryId=${id}`, user.userId), []);

  useEffect(() => {
    // const ws = new YWebSocket(url);
    ws.init();
    ws.onmessage = ({ data }) => {
      console.log('attrws');
      const socketData = JSON.parse(data) as SocketMsgType;
      if (socketData.mesType === 'init') {
        // construct tree new YTree(tree)
        yAttr.init(socketData?.content?.currentFeature, socketData?.content?.recycleFeature);
        yAttr.history.init([...(socketData?.content?.operationLog || [])]);
        // 执行服务器未完成的操作记录 除了未完成的新增操作之外
        const opeLists = socketData?.content?.unfinishedLog || [];
        for (let i = opeLists.length - 1; i >= 0; i--) {
          yAttr.history.push(opeLists[i]);
          if (opeLists[i].operationType === 'add' && !opeLists[i].isFinished) {
            continue;
          }
          yAttr.operation.add(JSON.parse(opeLists[i].param));
        }
        attrMsg$.emit({
          type: 'refreshTree',
        });
        attrMsg$.emit({
          type: 'refreshHistory',
        });
        attrMsg$.emit({
          type: 'refreshCategory',
          content: socketData.content.category || {},
        });
      }
      if (socketData.mesType === 'operation') {
        yAttr.operation.add(socketData.content);
        attrMsg$.emit({
          type: 'refreshTree',
        });
      }
      if (socketData.mesType === 'opeLog') {
        yAttr.history.push(socketData.content);
        attrMsg$.emit({
          type: 'refreshHistory',
        });
      }
      if (socketData.mesType === 'user') {
        yAttr.users.push(socketData.content);
      }
    };
    ws.onclose = () => {
      yAttr.onDestory();
    };
    return () => {
      ws.close();
    };
  }, []);

  attrMsg$.useSubscription((msg) => {
    if (msg.type === 'operation') {
      ws.send(JSON.stringify({ mesType: msg.type, content: msg.content }));
    }
    if (msg.type === 'user') {
      // 记录一下本用户的最近一次选中操作，
      if (msg.content.location) {
        yAttr.users.self.location = msg.content.location;
      }
      ws.send(JSON.stringify({ mesType: msg.type, content: { ...msg.content, userId: user.userId } }));
    }
  });

  const onRefresh = () => {
    attrMsg$.emit({
      type: 'refreshTree',
    });
    attrMsg$.emit({
      type: 'refreshHistory',
    });
  };

  return (
    <Panel>
      <span className={styles.headerTitle}>
        <LeftOutlined onClick={back} />
        <span>详情</span>
      </span>
      <div>
        <Header attrMsg$={attrMsg$} />
        <Table attrMsg$={attrMsg$} yAttr={yAttr} />
      </div>
      <div>
        <RND
          text={
            <>
              <FileTextOutlined style={{ fontSize: 20 }} />
              <div>修订历史</div>
            </>
          }
          noPadding
          title={'修订历史'}
        >
          <History treeMsg$={attrMsg$} yTree={yAttr} />
        </RND>
        <RND
          text={
            <>
              <DeleteOutlined style={{ fontSize: 20 }} />
              <div>回收站</div>
            </>
          }
          noPadding
          defaultPosY={100}
          title={'回收站'}
        >
          <TrashAttr attrMsg$={attrMsg$} yTree={yAttr} />
        </RND>
        <RND
          text={
            <>
              <AppstoreOutlined style={{ fontSize: 20 }} />
              <div>功能列表</div>
            </>
          }
          defaultPosY={130}
          title={'功能列表'}
        >
          <Tool />
        </RND>
      </div>
    </Panel>
  );
}
