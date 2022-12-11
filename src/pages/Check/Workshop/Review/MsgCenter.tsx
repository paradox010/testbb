import { useEffect, useContext } from 'react';
import { useCreation, useEventEmitter } from 'ahooks';

import Process from './Process';
import Freeze from './Freeze';

import YWebSocket from '@/components/websocket';
// import UsersCenter from './socketClass/UsersCenter';
import VoteCenter from './socketClass/VoteCenter';
import { pushRecord } from './socketClass/record';

import type { CompMsgType, MsgDataType, SocketMsgType, StepStateType } from './msg.d';
import { YTree } from '@/pages/Struct/Construct/Tree/node';
import BasicContext, { stepState } from './basicContext';

// 中转站接受服务端消息并转换成组件内部消息通知
const url = `ws://${window.location.host}/api/websocket/review?reviewId=1&domainId=1`;

// style的资源会浪费，所以在最外层维护,如果不定义则用全局的style维护
const style = document.createElement('style');
style.type = 'text/css';

function initTree(socketData, msgData: MsgDataType) {
  msgData.yTree.init(socketData?.content?.currentTree, socketData?.content?.recycleTree || []);
  const opeLists = socketData?.content?.unfinishedLog || [];
  for (let i = opeLists.length - 1; i >= 0; i--) {
    // msgData.yTree.history.push(opeLists[i]);
    const opeliopt = opeLists[i].operationType;
    if (opeliopt === 'add' && !opeLists[i].isFinished) {
      continue;
    }
    if (opeliopt === 'sync' || opeliopt === 'cover') {
      continue;
    }
    msgData.yTree.operation.add(JSON.parse(opeLists[i].param));
  }
}

function initSpecialOpes(socketData, state: StepStateType) {
  const opeLists = socketData?.content?.unfinishedLog || [];
  state.specialOpes = [];
  for (let i = opeLists.length - 1; i >= 0; i--) {
    const opeliopt = opeLists[i].operationType;
    if (opeliopt === 'sync' || opeliopt === 'cover') {
      const iii = JSON.parse(opeLists[i]?.param).id;
      state.specialOpes.push({
        id: iii,
        opeType: opeliopt,
      });
      continue;
    }
  }
}

export default function Stand() {
  const basic = useContext(BasicContext);
  const stepMsg$ = useEventEmitter<CompMsgType>();
  // 只在第三步的时候需要用到
  const msgData = useCreation<MsgDataType>(
    () => ({
      yTree: new YTree([], [], {
        userId: basic.self.userId,
        style,
      }),
      // usersCenter: new UsersCenter(basic.self, basic.member),
      voteCenter: new VoteCenter(),
      record: [],
      self: basic.self,
    }),
    [],
  );
  const ws = useCreation(() => new YWebSocket(url, basic.self?.token), []);

  useEffect(() => {
    ws.init();
    ws.onmessage = ({ data }) => {
      console.log('ws');
      const socketData = JSON.parse(data) as SocketMsgType;
      if (socketData.mesType === 'init') {
        // msgData.usersCenter.init(basic.self, socketData.content.member);
        ['isFreeze', 'member', 'record', 'reviewVote', 'processState', 'proposalDomainId', 'sign'].forEach((k) => {
          stepState[k] = socketData.content[k];
        });
        const st = socketData.content.processState;
        if (st === 4 || st === 5) {
          if (socketData.content.reviewVote?.id) {
            msgData.voteCenter.push(socketData.content.reviewVote, socketData.content.isVote, basic.self.userId);
            setTimeout(() => {
              stepMsg$.emit({
                type: 'refreshVote',
              });
            });
          }
        }
        if (st === 4) {
          initTree(socketData, msgData);
          initSpecialOpes(socketData, stepState);
          setTimeout(() => {
            stepMsg$.emit({
              type: 'refreshTree',
              autoExpand: true,
              ifInit: true,
            });
          });
        }
      }
      if (socketData.mesType === 'user' || socketData.mesType === 'check' || socketData.mesType === 'sign') {
        const { userId, ...rest } = socketData.content;
        const item = stepState.member.find((v) => v.userId === userId);
        if (item) {
          // eslint-disable-next-line guard-for-in
          for (const k in rest) {
            item[k] = rest[k];
          }
        }
      }
      if (socketData.mesType === 'record') {
        pushRecord(stepState.record, socketData.content);
      }
      if (socketData.mesType === 'stage') {
        stepState.processState = socketData.content.processState;
        if (socketData.content.processState === 3) {
          stepState.proposalDomainId = socketData.content.proposalDomainId;
        }
        if (socketData.content.processState === 4) {
          initTree(socketData, msgData);
          initSpecialOpes(socketData, stepState);
          setTimeout(() => {
            stepMsg$.emit({
              type: 'refreshTree',
            });
          });
        }
        if (socketData.content.processState === 5) {
          if (socketData.content.reviewVote?.id) {
            msgData.voteCenter.push(socketData.content.reviewVote, socketData.content.isVote, basic.self.userId);
            setTimeout(() => {
              stepMsg$.emit({
                type: 'refreshVote',
              });
            });
          }
        }
      }
      if (socketData.mesType === 'vote') {
        msgData.voteCenter.pushOpe(socketData.content);
        stepMsg$.emit({
          type: 'refreshVote',
        });
      }
      if (socketData.mesType === 'operation') {
        msgData.yTree.operation.add(socketData.content);
        const thoptype = socketData.content;
        if (thoptype.opeType === 'sync' || thoptype.opeType === 'cover') {
          // 去掉self
          // if(socketData.content.userId===basic.self.userId){

          // }
          stepState.specialOpes = stepState.specialOpes.filter((v) => v.id !== 0).filter((v) => v.id !== thoptype.id);
        }
        stepMsg$.emit({
          type: 'refreshTree',
        });
      }
      if (socketData.mesType === 'freeze') {
        stepState.isFreeze = socketData.content.isFreeze;
      }
    };
    ws.onclose = () => {
      // yTree.onDestory();
    };
    return () => {
      ws.close?.();
    };
  }, []);

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'check' || msg.type === 'sign' || msg.type === 'freeze') {
      console.log('send', msg);
      ws.send(JSON.stringify({ mesType: msg.type, content: msg.content }));
    }
    if (msg.type === 'process') {
      console.log('next', msg);
      ws.send(JSON.stringify({ mesType: 'stage', content: msg.content }));
    }
    if (msg.type === 'compVote') {
      console.log('vote', msg);
      ws.send(JSON.stringify({ mesType: 'vote', content: msg.content }));
    }
    if (msg.type === 'operation') {
      console.log('ope', msg);
      let newMsg = msg.content as any;
      if (msg.content.opeType === 'sync') {
        newMsg = {
          ...msg.content,
          newNodes: [
            {
              parentId: msg.content.newNodes?.[0]?.parentId,
              domainPubId: msg.content.newNodes?.[0]?.domainPubId,
              categoryPubId: msg.content.newNodes?.[0]?.id,
            },
          ],
        };
      }
      if (msg.content.opeType === 'cover') {
        newMsg = {
          ...msg.content,
          newNodes: [
            {
              id: msg.content.newNodes?.[0]?.parentId,
              domainPubId: msg.content.newNodes?.[0]?.domainPubId,
              categoryPubId: msg.content.newNodes?.[0]?.id,
            },
          ],
        };
      }
      if (msg.content.opeType === 'cover' || msg.content.opeType === 'sync') {
        // 需要进入specialOpes队列
        stepState.specialOpes.push({
          id: 0, // self
          opeType: msg.content.opeType,
        });
      }
      ws.send(JSON.stringify({ mesType: msg.type, content: newMsg }));
    }

    // 服务器消息 测试用
    // const newMsg = msg as any as SocketMsgType;
    // newMsg.mesType = msg.type;
    // if (msg.type === 'process') {
    //   newMsg.mesType = 'stage';
    // }
    // if (msg.type === 'compVote') {
    //   if(msg.content.type === 1){
    //     newMsg.content.id = `${Math.random()}`;
    //     newMsg.content.createTime = new Date().valueOf();
    //   }
    //   newMsg.mesType = 'vote';
    // }
    // if(newMsg.mesType === 'vote'){
    //   msgData.voteCenter.push(newMsg.content);
    //   stepMsg$.emit({
    //     type: 'refreshVote',
    //   })
    // }
    // if (newMsg.mesType === 'check') {
    //   msgData.usersCenter.push(newMsg.content);
    //   stepMsg$.emit({
    //     type: 'refreshUsers',
    //   });
    // }
    // if (newMsg.mesType === 'stage') {
    //   const noUpdate = msgData.processState === newMsg.content.processState;
    //   msgData.processState = newMsg.content.processState;
    //   if (newMsg.content.processState === 3) {
    //     msgData.proposalDomainId = newMsg.content.proposalDomainId;
    //   }
    //   if (noUpdate) {
    //     stepMsg$.emit({
    //       type: 'refreshProposal',
    //     });
    //   } else {
    //     stepMsg$.emit({
    //       type: 'refreshStep',
    //     });
    //   }
    // }
  });

  return (
    <>
      <Process stepMsg$={stepMsg$} msgData={msgData} />
      <Freeze stepMsg$={stepMsg$} msgData={msgData} />
    </>
  );
}
