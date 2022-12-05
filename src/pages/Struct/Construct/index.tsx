import AttrRoute from './AttrRoute';
import Panel from './Panel';
import RND from './RND';
import TrashTree from './TrashTree';
import History from './History';
import Tree from './Tree';
import DomainSelect from './DomainSelect';
import store from '@/store';

// import { generateData } from './Tree/utils/dataUtils';
import YModal from './Modal';
import { YTree } from './Tree/node';
import YWebSocket from '@/components/websocket';
import type { MsgType, SocketMsgType } from './msg.d';

import { useEffect, useState } from 'react';
import { DeleteOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { useLocation } from 'ice';
import { useCreation, useEventEmitter, useMount } from 'ahooks';

import { getParams } from '@/utils/location';

import styles from './index.module.less';
import { Spin } from 'antd';

const url = `ws://${window.location.host}/api/websocket/product/category`;
// const url = 'ws://localhost:3333/api/websocket/product/category?domainId=1001';

// style的资源会浪费，所以在最外层维护,如果不定义则用全局的style维护
const style = document.createElement('style');
style.type = 'text/css';

let domainId = '';
export default function Stand() {
  const [user] = store.useModel('user');

  const treeMsg$ = useEventEmitter<MsgType>();
  const yTree = useCreation(
    () =>
      new YTree([], [], {
        userId: user?.userId || '',
        style,
      }),
    [],
  );

  // useEffect(() => {
  //   // const ws = new YWebSocket(url);
  //   ws.init();
  //   ws.onmessage = ({ data }) => {
  //     console.log('ws');
  //     const socketData = JSON.parse(data) as SocketMsgType;
  //     if (socketData.mesType === 'init') {
  //       // construct tree new YTree(tree)
  //       yTree.init(socketData?.content?.currentTree, socketData?.content?.recycleTree);
  //       yTree.history.init([...(socketData?.content?.operationLog || [])]);
  //       // 执行服务器未完成的操作记录 除了未完成的新增操作之外
  //       const opeLists = socketData?.content?.unfinishedLog || [];
  //       for (let i = opeLists.length - 1; i >= 0; i--) {
  //         yTree.history.push(opeLists[i]);
  //         if (opeLists[i].operationType === 'add' && !opeLists[i].isFinished) {
  //           continue;
  //         }
  //         yTree.operation.add(JSON.parse(opeLists[i].param));
  //       }
  //       treeMsg$.emit({
  //         type: 'refreshTree',
  //         autoExpand: true,
  //       });
  //       treeMsg$.emit({
  //         type: 'refreshHistory',
  //       });
  //     }
  //     if (socketData.mesType === 'operation') {
  //       yTree.operation.add(socketData.content);
  //       treeMsg$.emit({
  //         type: 'refreshTree',
  //       });
  //     }
  //     if (socketData.mesType === 'opeLog') {
  //       yTree.history.push(socketData.content);
  //       treeMsg$.emit({
  //         type: 'refreshHistory',
  //       });
  //     }
  //     if (socketData.mesType === 'user') {
  //       yTree.users.push(socketData.content);
  //     }
  //   };
  //   ws.onclose = () => {
  //     yTree.onDestory();
  //   };
  //   return () => {
  //     ws.close?.();
  //   };
  // }, []);

  const ws = useCreation(() => new YWebSocket(url, user?.token), []);

  const location = useLocation();

  useMount(() => {
    domainId = '';
  });
  useEffect(() => {
    if (getParams()?.domainId !== domainId) {
      domainId = getParams()?.domainId;
      ws.reset(`${url}?domainId=${domainId}`, user?.token);
      ws.onmessage = ({ data }) => {
        console.log('ws');
        const socketData = JSON.parse(data) as SocketMsgType;
        if (socketData.mesType === 'init') {
          // construct tree new YTree(tree)
          yTree.init(socketData?.content?.currentTree, socketData?.content?.recycleTree);
          yTree.history.init([...(socketData?.content?.operationLog || [])]);
          // 执行服务器未完成的操作记录 除了未完成的新增操作之外
          const opeLists = socketData?.content?.unfinishedLog || [];
          for (let i = opeLists.length - 1; i >= 0; i--) {
            yTree.history.push(opeLists[i]);
            if (opeLists[i].operationType === 'add' && !opeLists[i].isFinished) {
              continue;
            }
            yTree.operation.add(JSON.parse(opeLists[i].param));
          }
          treeMsg$.emit({
            type: 'refreshTree',
            autoExpand: true,
            ifInit: true,
          });
          treeMsg$.emit({
            type: 'refreshHistory',
            ifInit: true,
          });
        }
        if (socketData.mesType === 'operation') {
          yTree.operation.add(socketData.content);
          treeMsg$.emit({
            type: 'refreshTree',
          });
        }
        if (socketData.mesType === 'opeLog') {
          yTree.history.push(socketData.content);
          treeMsg$.emit({
            type: 'refreshHistory',
          });
        }
        if (socketData.mesType === 'user') {
          yTree.users.push(socketData.content);
        }
      };
      ws.onclose = () => {
        yTree.onDestory();
      };
    }
    return () => {
      ws?.close?.();
    };
  }, [location]);

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'operation') {
      ws.send(JSON.stringify({ mesType: msg.type, content: msg.content }));
    }
    if (msg.type === 'user') {
      // 记录一下本用户的最近一次选中操作，
      if (msg.content.location) {
        yTree.users.self.location = msg.content.location;
      }
      ws.send(JSON.stringify({ mesType: msg.type, content: { ...msg.content, userId: user.userId } }));
    }
  });

  return (
    <>
      <AttrRoute treeMsg$={treeMsg$}>
        <Panel>
          <span className={styles.headerTitle}>
            运维版本信息
            <DomainSelect />
          </span>
          <Tree treeMsg$={treeMsg$} yTree={yTree} />
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
              <History treeMsg$={treeMsg$} yTree={yTree} />
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
              <TrashTree treeMsg$={treeMsg$} yTree={yTree} />
            </RND>
            <RND
              text={
                <div style={{ position: 'absolute', bottom: 10, right: 2 }}>
                  <QuestionCircleOutlined style={{ fontSize: 20 }} />
                  <div>操作说明</div>
                </div>
              }
              defaultPosY={130}
              title={'操作说明'}
            >
              <div>一些操作说明</div>
            </RND>
          </div>
        </Panel>
      </AttrRoute>
      <YModal treeMsg$={treeMsg$} yTree={yTree} />
    </>
  );
}
