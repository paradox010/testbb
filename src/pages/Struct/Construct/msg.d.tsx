import type { RTreeNode, HistoryItem, OpeItem, UserItem } from './Tree/node';
// 服务器通信
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
interface SocketLoc {
  mesType: 'location';
}
interface SocketUser {
  mesType: 'user';
  content: UserItem;
}

export type SocketMsgType = SocketInit | SocketUser | SocketOpe | SocketLoc | SocketLog;

// 组件之间通信
interface refreshTree {
  type: 'refreshTree';
  autoExpand?: boolean;
}
interface refreshHistory {
  type: 'refreshHistory';
}
// 属性内接受外部节点的内容
interface refreshCategory {
  type: 'refreshCategory';
  content: RTreeNode;
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
interface modal {
  type: 'modal';
  open: 'add' | 'update' | 'move' | 'delete' | 'move_confirm';
  modalData?: {
    id?: string;
    name?: string;
    parentId?: string;
    parentName?: string;
    description?: string;
  };
}
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
export type MsgType = refreshTree | refreshHistory | refreshCategory | treePos | ope | modal | route | user;
