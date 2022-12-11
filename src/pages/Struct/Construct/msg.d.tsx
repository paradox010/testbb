import type { RTreeNode, HistoryItem, OpeItem, UserItem } from './Tree/node';

interface SpecialOpe {
  id: number;
  opeType: 'sync' | 'cover';
}

export interface StepStateType {
  // 需要挂起的事件 内部维护
  specialOpes: SpecialOpe[];
  isFreeze?: boolean;
}
// 服务器通信 接受到的服务器消息
interface SocketInit {
  mesType: 'init';
  content: {
    currentTree: any[];
    operationLog: any[];
    unfinishedLog: any[];
    recycleTree: any[];
    currentFeature: any[];
    recycleFeature: any[];
    category: RTreeNode;
    isFreeze: boolean;
  };
}

interface SocketLog {
  mesType: 'opeLog';
  content: HistoryItem;
}
interface SocketOpe {
  mesType: 'operation';
  content: OpeItem;
}
export { OpeItem };
interface SocketLoc {
  mesType: 'location';
}
interface SocketUser {
  mesType: 'user';
  content: UserItem;
}
// 废弃
interface SocketMoreLog {
  mesType: 'moreLog';
  content: {
    logs: HistoryItem[];
  };
}
interface SocketReset {
  mesType: 'reset';
}

export type SocketMsgType = SocketInit | SocketUser | SocketOpe | SocketLoc | SocketLog | SocketMoreLog | SocketReset;

// 组件之间通信
interface refreshTree {
  type: 'refreshTree';
  autoExpand?: boolean;
  ifInit?: boolean;
}
interface refreshHistory {
  type: 'refreshHistory';
  ifInit?: boolean;
}
// 属性内接受外部节点的内容
interface refreshCategory {
  type: 'refreshCategory';
  content: RTreeNode;
  ifInit?: boolean;
}

interface treePos {
  type: 'treePos';
  content: {
    id: string;
  };
}
interface ope {
  type: 'operation';
  content: OpeItem;
}
// 弹窗

export type CompModalType = {
  type: 'modal';
  open: 'add' | 'update' | 'move' | 'delete' | 'move_confirm' | 'sync' | 'cover' | 'domain_drag_confirm';
  modalData?: {
    id?: string;
    name?: string;
    parentId?: string;
    parentName?: string;
    description?: string;
    domainPubId?: string;
  };
};
// router
interface route {
  type: 'route';
  path: string;
  content?: {
    id?: string;
    name?: string;
  };
}
// 用户行为 对外发送
interface user {
  type: 'user';
  content: Partial<UserItem>;
}
// morelog
interface moreLogRes {
  type: 'moreLogRes';
  content: {
    list: HistoryItem[];
  };
}

interface CompReset {
  type: 'reset'
}

export type MsgType =
  | refreshTree
  | refreshHistory
  | refreshCategory
  | treePos
  | ope
  | CompModalType
  | route
  | user
  | moreLogRes
  | CompReset;
