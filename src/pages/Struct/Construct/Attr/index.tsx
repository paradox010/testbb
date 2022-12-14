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
import { getParams } from '@/utils/location';

const url = `${process.env.BASEWS_PFX}://${window.location.host}${
  process.env.BASEWS || ''
}/api/websocket/product/feature`;

const style = document.createElement('style');
style.type = 'text/css';

export default function Content({ id, back }) {
  const [user] = store.useModel('user');

  const attrMsg$ = useEventEmitter<MsgType>();
  const yAttr = useCreation(
    () =>
      new YTree([], [], {
        userId: user.userId || '',
        style,
        prefix: 'attrLoc',
        updateKeys: ['name', 'dataType', 'unit', 'value'],
        reverseOrder: true,
      }),
    [],
  );
  const ws = useCreation(
    () => new YWebSocket(`${url}?domainId=${getParams()?.domainId}&categoryId=${id}`, user?.token),
    [],
  );

  useEffect(() => {
    // const ws = new YWebSocket(url);
    ws.init();
    ws.onmessage = ({ data }) => {
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
          ifInit: true,
        });
        attrMsg$.emit({
          type: 'refreshHistory',
          ifInit: true,
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
    if (msg.type === 'back') {
      ws.send(JSON.stringify({ mesType: msg.type, content:{} }));
    }
    if (msg.type === 'user') {
      // 记录一下本用户的最近一次选中操作，
      if (msg.content.location) {
        yAttr.users.self.location = msg.content.location;
      }
      ws.send(JSON.stringify({ mesType: msg.type, content: { ...msg.content, userId: user.userId } }));
    }
  });

  return (
    <Panel>
      <span className={styles.headerTitle}>
        <LeftOutlined onClick={back} />
        <span>详情</span>
      </span>
      <div style={{ height: 'auto', overflow: 'auto' }}>
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
          <History treeMsg$={attrMsg$} yTree={yAttr} categoryId={id} />
        </RND>
        <RND
          text={
            <>
              <DeleteOutlined style={{ fontSize: 20 }} />
              <div>回收站</div>
            </>
          }
          noPadding
          defaultPosY={0}
          title={'回收站'}
        >
          <TrashAttr attrMsg$={attrMsg$} yTree={yAttr} />
        </RND>
        <RND
          text={
            <>
              <AppstoreOutlined style={{ fontSize: 20 }} />
              <div>智能辅助</div>
            </>
          }
          defaultPosY={20}
          title={'智能辅助'}
        >
          <Tool />
        </RND>
      </div>
    </Panel>
  );
}
