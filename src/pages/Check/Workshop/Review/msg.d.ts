import React from 'react';
import { YTree } from '@/pages/Struct/Construct/Tree/node';
import type VoteCenter from './socketClass/VoteCenter';

import type { OpeItem, CompModalType } from '@/pages/Struct/Construct/msg.d';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { BasicDataNode } from 'rc-tree';

// 是否需要记录自己的一些信息？
export interface User {
  userName: string;
  userId: string;
  userRole: string; // 0:系统
  isOnline?: boolean;
  isCheck?: boolean; // 一键签到
  company?: string;
  token?: string;
  isSign?: boolean; // 签名
  sign?: string;
  isRemoved?: boolean;
  phone?: string;
  emergencyContact?: string;
}
interface Vote {
  title: string; // 投票的内容
  id: string; // 投票id
}

// 可以用来定位演讲人的position
interface Pos {
  treeId?: string;
  treeLocation?: string;
  ifInAttr?: boolean;
  attrLocation?: string;
}

// 接受到的服务器端消息
// init
interface SocketBasicContent {
  isFreeze?: boolean;
  record: RecordType[];
  member: User[];
  proposalDomainId?: string;
}
interface SocketInitStep12Type extends SocketBasicContent {
  processState: 1 | 2;
}
interface SocketInitStep3Type extends SocketBasicContent {
  processState: 3;
}
interface SocketInitStep4Type extends SocketBasicContent {
  processState: 4;
  currentTree: any[];
  recycleTree: any[];
  unfinishedLog: any[];
  objection: ObjectionType[];
  isVote: boolean;
  reviewVote: VoteBasicType;
}
interface SocketInitStep5Type extends SocketBasicContent {
  isFreeze?: boolean;
  processState: 5;
  record: RecordType[];
  member: User[];
  isVote: boolean;
  reviewVote: VoteBasicType;
}
interface SocketInitStep6Type extends SocketBasicContent {
  processState: 6;
  sign?: string;
}
interface SocketInitStep7Type extends SocketBasicContent {
  processState: 7;
  version?: string;
  isVote: boolean;
  reviewVote: VoteBasicType;
}

interface SocketInitStepType {
  mesType: 'init';
  content:
    | SocketInitStep12Type
    | SocketInitStep3Type
    | SocketInitStep4Type
    | SocketInitStep5Type
    | SocketInitStep6Type
    | SocketInitStep7Type;
}

// 上线/离线
interface SocketOnlineType {
  mesType: 'user';
  content: {
    userId: string;
    isOnline: boolean;
  };
}
// 签到
interface SocketCheckType {
  mesType: 'check';
  content: {
    userId: string;
    isCheck: boolean;
  };
}
// 剔除用户
interface SocketRemoveType {
  mesType: 'remove';
  content: {
    userId: string;
    isRemoved: true;
    removeReason: string;
  };
}
// 会议记录消息
interface RecordOnlineType extends User {
  recordType: 'system';
  receiveTime: number;
  content: string;
  id: string;
}
interface RecordOpeType extends User {
  recordType: 'operation';
  receiveTime: number;
  content: string;
  id: string;
}
type RecordType = RecordOnlineType | RecordOpeType;
interface SocketRecordType {
  mesType: 'record';
  content: RecordType;
}

interface SocketObjectionType {
  mesType: 'objection',
  content: ObjectionType,
}

interface SocketStepType {
  mesType: 'stage';
  content:
    | {
        processState: 1 | 2 | 6;
      }
    | {
        processState: 3;
        isFirstProposal?: boolean;
        proposalDomainId: string;
        proposalStartTime: number;
      }
    | SocketInitStep4Type
    | SocketInitStep5Type
    | {
        processState: 7;
        version?: string;
        reviewVote: VoteBasicType;
        isVote: boolean;
      };
}

interface VoteBasicType {
  id: string;
  content: string;
  createTime: number;
  isFinished?: boolean;
  voteResult?: UserVoteRes[];
  result?: boolean;
}
interface VoteStartType extends VoteBasicType {
  // 创建投票 / 结束投票
  type: 1;
}
export interface UserVoteRes {
  userId: string;
  isAgree: boolean;
  isRemoved?: boolean;
}
interface VoteEndType extends VoteBasicType {
  // 创建投票 / 结束投票
  type: 2;
  result: boolean; // 通过或者未通过
  isFinished: true;
  createTime: number;
  voteResult: UserVoteRes[];
}
interface VoteUserType extends VoteBasicType {
  // 用户投票的行为
  userId: string;
  isAgree: boolean;
  type: 3;
}
export type SocketVoteItem = VoteStartType | VoteEndType | VoteUserType;
interface SocketVoteType {
  mesType: 'vote';
  content: SocketVoteItem;
}
interface SocketRemindVoteType {
  mesType: 'remind';
  content: SocketVoteItem;
}

interface SocketOpeType {
  mesType: 'operation';
  content: OpeItem;
}

interface SocketFreezeType {
  mesType: 'freeze';
  content: {
    isFreeze: boolean;
  };
}

interface SocketSignType {
  mesType: 'sign';
  content: {
    userId: string;
    isSign: boolean;
    sign: string;
  };
}


export type SocketMsgType =
  | SocketInitStepType
  | SocketCheckType
  | SocketRemoveType
  | SocketOnlineType
  | SocketRecordType
  | SocketObjectionType
  | SocketStepType
  | SocketVoteType
  | SocketRemindVoteType
  | SocketOpeType
  | SocketFreezeType
  | SocketSignType;

// 组件通信
type RefreshType =
  | {
      type: 'refreshAll' | 'refreshUsers' | 'refreshVote';
    }
  | {
      type: 'refreshTree';
      autoExpand?: boolean;
      ifInit?: boolean;
    };
// checkin
interface UserCheckType {
  type: 'check';
  content: {
    userId: string;
    isCheck: true;
  };
}

type MyPick<T, K extends keyof T> = {
  [P in keyof K extends keyof T ? K : never]: T[P];
};
// type MyPick<T, K extends keyof T> = {
//   [P in keyof T as P extends K ? P : never]: T[P];
// };
// go next
interface ProcessType {
  type: 'process';
  content: MyPick<SocketStepType['content'], 'processState' | 'isFirstProposal' | 'proposalDomainId' | 'version'>;
}

// 查看详情，页面切换
interface RouteType {
  type: 'route';
  path: 'tree' | 'attr';
  ifModal?: boolean; // 是否以弹框模式
  content?: {
    id?: string; // attr id
    name?: string;
  };
}

interface CompVoteType {
  type: 'compVote';
  content: Omit<VoteStartType, 'createTime' | 'id'> | Omit<VoteEndType, 'voteResult'> | VoteUserType;
}

interface CompRemindVoteType {
  type: 'remind';
  content: {
    id: string;
  };
}

interface OpeType {
  type: 'operation';
  content: OpeItem;
}

interface CompFreezeType {
  type: 'freeze';
  content: {
    isFreeze: boolean;
  };
}

interface CompSignType {
  type: 'sign';
  content: {
    sign: string;
  };
}

interface CompTreePosType {
  type: 'treePos';
  content: {
    id: string;
  };
}

interface CompBackType {
  type: 'back';
}

interface CompObjectionType {
  type: 'objection';
  content: {
    recordId: string;
  }
}

type CompRemoveType = Omit<SocketRemoveType, 'mesType'> & {
  type: 'remove';
};

export type CompMsgType =
  | RefreshType
  | UserCheckType
  | ProcessType
  | RouteType
  | CompVoteType
  | CompRemindVoteType
  | OpeType
  | CompModalType
  | CompFreezeType
  | CompSignType
  | CompBackType
  | CompObjectionType
  | CompRemoveType
  | CompTreePosType;

interface SpecialOpe {
  id: number;
  opeType: 'sync' | 'cover' | 'import';
}
interface ObjectionType {
  id: string;
  userName: string;
  recordContent: string;
  objectionCount: number;
}
// stepState 存储全局的状态 proxy做双向数据绑定
export interface StepStateType {
  objection: ObjectionType[];
  record: RecordType[];
  member: User[];
  processState: number;
  proposalDomainId?: string;
  proposalStartTime?: number;
  isFreeze: boolean;
  version?: string;
  selectVersion?: string;
  isVote?: boolean;
  reviewVote?: VoteBasicType;
  // 需要挂起的事件 内部维护
  specialOpes: SpecialOpe[];
  sign: string;
}

// stepComp & msgData
export interface MsgDataType {
  yTree: YTree;
  voteCenter: VoteCenter;
  self: User;
  attrMsg$?: EventEmitter<CompMsgType>;
  attrMsgData?: MsgDataType;
}

export interface StepProps {
  msgData: MsgDataType;
  stepMsg$: EventEmitter<CompMsgType>;
}

interface StepSubCompType {
  Title: React.FC<StepProps>;
  Tool?: React.FC<StepProps>;
}

export type StepCompType = React.FC<StepProps> & StepSubCompType;

interface RTreeNode extends BasicDataNode {
  id: string;
  name: string;
  editStatus?: number;
  children?: RTreeNode[];
  isLeaf?: boolean;
}
