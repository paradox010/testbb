import React, { useContext, useEffect } from 'react';

import YWebSocket from '@/components/websocket';

import Header from '@/pages/Struct/Construct/Attr/Header';
import Table from '@/pages/Struct/Construct/Attr/Table';

import type { CompMsgType, MsgDataType, SocketMsgType } from '../../msg.d';
import { YTree } from '@/pages/Struct/Construct/Tree/node';

import { useCreation, useEventEmitter } from 'ahooks';
import BasicContext from '../../basicContext';

import styles from './index.module.less';
import { LeftOutlined } from '@ant-design/icons';

import TrashAttr from './TrashAttr';

const url = `ws://${window.location.host}/api/websocket/review/feature`;

const style = document.createElement('style');
style.type = 'text/css';

const EditMsg = React.forwardRef<
  {},
  {
    id: any;
    back: any;
    upData: any;
  }
>(({ id, back, upData }, ref) => {
  const basic = useContext(BasicContext);
  const attrMsg$ = useEventEmitter<CompMsgType>();
  // 只在第三步的时候需要用到
  const msgData = useCreation<Pick<MsgDataType, 'yTree'>>(
    () => ({
      yTree: new YTree([], [], {
        userId: basic.self.userId,
        style,
        updateKeys: ['name', 'dataType', 'unit', 'value'],
        reverseOrder: true,
      }),
    }),
    [],
  );

  upData.attrMsg$ = attrMsg$;
  upData.attrMsgData = msgData;

  React.useImperativeHandle(ref, () => ({
    TrashAttr: <TrashAttr stepMsg$={attrMsg$} msgData={msgData} />,
  }));

  const ws = useCreation(
    () => new YWebSocket(`${url}?reviewId=${basic.id}&domainId=${basic.domainId}&categoryId=${id}`, basic.self?.token),
    [],
  );

  useEffect(() => {
    if (id) {
      ws.init();
      ws.onmessage = ({ data }) => {
        const socketData = JSON.parse(data) as SocketMsgType;
        if (socketData.mesType === 'init') {
          // construct tree new YTree(tree)
          msgData.yTree.init(socketData?.content?.currentFeature, socketData?.content?.recycleFeature);
          // msgData.yTree.history.init([...(socketData?.content?.operationLog || [])]);
          // 执行服务器未完成的操作记录 除了未完成的新增操作之外
          const opeLists = socketData?.content?.unfinishedLog || [];
          for (let i = opeLists.length - 1; i >= 0; i--) {
            // msgData.yTree.history.push(opeLists[i]);
            if (opeLists[i].operationType === 'add' && !opeLists[i].isFinished) {
              continue;
            }
            msgData.yTree.operation.add(JSON.parse(opeLists[i].param));
          }
          attrMsg$.emit({
            type: 'refreshTree',
          });
          attrMsg$.emit({
            type: 'refreshCategory',
            content: socketData.content.category || {},
          });
        }
        if (socketData.mesType === 'operation') {
          msgData.yTree.operation.add(socketData.content);
          attrMsg$.emit({
            type: 'refreshTree',
          });
        }
      };
      ws.onclose = () => {
        msgData.yTree.onDestory();
      };
    }
    return () => {
      ws?.close();
    };
  }, [id]);

  attrMsg$.useSubscription((msg) => {
    if (msg.type === 'operation') {
      ws.send(JSON.stringify({ mesType: msg.type, content: msg.content }));
    }
  });

  return (
    <div>
      <span className={styles.headerTitle}>
        <LeftOutlined onClick={back} />
        <span>详情</span>
      </span>
      <Header attrMsg$={attrMsg$} />
      <Table attrMsg$={attrMsg$} yAttr={msgData.yTree} />
    </div>
  );
});

export default EditMsg;
