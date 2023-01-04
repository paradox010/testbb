/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable max-lines */
/* eslint-disable no-param-reassign */
/*
 *tree==>flatNodes
 *对树的操作原子化成对单个节点的属性变更
 *操作记录历史建模为双向链表，时间戳排序，对树的操作转化成操作原子
 *性能优化：查找时间，hashmap每次也得遍历很久
 *不支持顶层节点的移动：回收站的顶层parentId和原始树的顶层parentId一样-考虑到删除后的undo，回收站的顶层id为trash
 */
import type { BasicDataNode } from 'rc-tree';

export interface RTreeNode extends BasicDataNode {
  name: string;
  id: string;
  parentId?: string;
  children?: RTreeNode[];
  editStatus: number; // -1无法编辑 0 1 2 3
  description?: string;
  type?: number; // 节点状态：新增/删除/更改中
  _isChecked?: boolean;
  // _parentIds?: string;
  path?: string;
}
export interface OpeNode {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
  offset?: number;
  oldPIDWhenMove?: string;
  oldOffsetWhenMove?: number;
  oldPID?: string; // 废弃 --只有当老节点和父节点一致的时候才会执行移动操作?
  domainPubId?: string;
  children?: RTreeNode[];
}
// 操作记录原子化 move是特殊的修改(parentId) 需要记录原信息做特殊处理
export interface OpeItem {
  id: number; // 时间戳
  newNodes?: OpeNode[]; // 这个list的用法暂定是错误的。只支持1个节点，多个节点的shouldReComputeWhenAdd状态无法界定
  // oldNodes?: OpeNode[];
  opeType: 'add' | 'update' | 'delete' | 'move' | 'sync' | 'cover' | 'import';
  // isServe?: boolean; // 是否由服务器主动发送
  before?: OpeItem;
  after?: OpeItem;
  shouldReComputeWhenAdd?: boolean; // add操作位插入的时候是否需要重新执行, 涉及到新节点内容
  moveOk?: boolean;
}
// 如何存储单个节点的操作记录和原始引用，不涉及到move的话只需要对节点的操作就可以恢复文档
interface Store {
  [key: string]: {
    state: RTreeNode;
    opes: OpeItem[]; // 暂定不存放新增操作，存放更新操作用来解决更新的冲突问题
  };
}

interface InitOpt {
  userId: string;
  style?: HTMLStyleElement;
  prefix?: string;
  isList?: boolean; // list模式下树不需要父节点/或者说父节点都是undefined 暂时没有用到
  reverseOrder?: boolean; // 新加入的节点
  updateKeys?: string[];
}

const defaultOpt = {
  userId: 'me',
  updateKeys: ['name', 'description'],
};

function mergeDefaultOpt(opt: InitOpt): InitOpt {
  return {
    ...defaultOpt,
    ...opt,
  };
}

// 操作链表：双线链表
class Operation {
  start: OpeItem = {
    id: 0,
  } as OpeItem;
  last: OpeItem = {
    id: Infinity,
  } as OpeItem;
  store: Store;
  tree: YTree;
  opt: InitOpt;

  constructor(tree: YTree, opt: InitOpt) {
    this.start.after = this.last;
    this.last.before = this.start;
    this.store = tree.store;
    this.tree = tree;
    this.opt = opt;
  }
  add(opeItem: OpeItem) {
    if (!opeItem) return;
    this.insertBuildOpe(opeItem);
  }
  // 插入操作原子 执行操作原子
  insertBuildOpe(opeItem: OpeItem) {
    const locNode = this.findLoc(opeItem);
    this.split(opeItem, locNode);

    if (locNode === this.last.before || opeItem.opeType === 'update' || opeItem.opeType === 'cover') {
      this.computeNewState(opeItem);
      return;
    }

    // 需要将关联节点的操作回滚再覆盖/或者计算出merge
    // add和move的冲突
    let nowLoc = opeItem;
    const computeOpes: OpeItem[] = [];
    while (nowLoc !== this.last) {
      computeOpes.push(nowLoc);
      nowLoc = nowLoc.after as OpeItem;
    }

    // sync 相当于特殊的add操作
    if (opeItem.opeType === 'add' || opeItem.opeType === 'sync' || opeItem.opeType === 'import') {
      // 如果后续有和该节点相关的move 或者 shouldwhenadd的move时 则需要重新执行所有的move
      // 否则的话只执行跟add相关的操作
      if (
        computeOpes.find((v) => {
          if (v.shouldReComputeWhenAdd) {
            return true;
          }
          if (v.newNodes?.find((n) => opeItem.newNodes?.map((k) => k.id).includes(n.id))) {
            return true;
          }
          return false;
        })
      ) {
        computeOpes.forEach((v) => {
          this.computeNewState(v, true);
        });
      } else {
        computeOpes
          .filter((v, idx) => idx === 0 || v.shouldReComputeWhenAdd)
          .forEach((v) => {
            this.computeNewState(v, true);
          });
      }
    }
    if (opeItem.opeType === 'move' || opeItem.opeType === 'delete') {
      // reverse except 0
      for (let i = computeOpes.length - 1; i > 0; i--) {
        const ope = computeOpes[i];
        if (!ope.moveOk) {
          continue;
        }
        if (ope.opeType === 'move' || ope.opeType === 'delete') {
          const newOpeNodes = ope.newNodes?.map((v) => {
            return {
              id: v.id,
              parentId: v.oldPIDWhenMove,
              offset: v.oldOffsetWhenMove,
            };
          });
          this.computeNewState(
            {
              id: -1,
              opeType: 'move',
              newNodes: newOpeNodes,
            },
            false,
            true,
          );
        }
      }
      computeOpes
        .filter((v) => v.opeType === 'move' || v.opeType === 'delete')
        .forEach((v) => {
          this.computeNewState(v, true);
        });
    }
  }

  // addstore 简单的append
  computeNewState(opeItem: OpeItem, outOrder?: boolean, isUndo?: boolean) {
    if (opeItem.opeType === 'add' || opeItem.opeType === 'sync' || opeItem.opeType === 'import') {
      opeItem?.newNodes?.forEach((n) => {
        if (this.store[n.id]) {
          // error 无视处理
          console.error('新增节点已经存在于节点树上');
          return;
        }
        if (!n.id) {
          console.error('该节点无任何标识');
          return;
        }
        if (!n.parentId) {
          console.error('新增节点没有父节点,将作为顶层节点添加');
          if (this.opt.reverseOrder) {
            this.tree.originTree.unshift(n as RTreeNode);
          } else {
            this.tree.originTree.push(n as RTreeNode);
          }
        } else {
          if (!this.store[n.parentId]) {
            // 游离节点的处理
            opeItem.shouldReComputeWhenAdd = true;
            console.error('没有找到新增节点的父节点');
            return;
          }
          const pNode = this.store[n.parentId].state;
          if (this.opt.reverseOrder) {
            pNode.children = [n as RTreeNode, ...(pNode.children || [])];
          } else {
            pNode.children = [...(pNode.children || []), n as RTreeNode];
          }
        }
        if (n.children) {
          this.addNodeWithChildren(n as RTreeNode);
        }
        // 修改state和store
        this.store[n.id] = {
          state: n as RTreeNode,
          opes: [],
        };
        opeItem.shouldReComputeWhenAdd = false;
      });
    }
    if (opeItem.opeType === 'update' || opeItem.opeType === 'cover') {
      opeItem?.newNodes?.forEach((n) => {
        const { state: node, opes = [] } = this.checkNodeWithEditPipeline(n.id, opeItem) || {};
        if (!node) {
          return;
        }
        const updatePackage = {};
        const updateKeys = this.opt.updateKeys || [];
        for (const k of updateKeys) {
          if (k in n) {
            updatePackage[k] = n[k];
          }
        }
        // 更新冲突应该如何解决 记录更新操作 当乱序时计算最终更新包
        const locIndex = this.addToStoreOpes(opes, opeItem);
        if (outOrder) {
          // 重新执行已经执行过的update操作来计算更新包
          for (let i = locIndex + 2; i < opes.length; i++) {
            if (opes[i].opeType === 'update' || opes[i].opeType === 'cover') {
              const middleNode = opes[i].newNodes?.find((x) => x.id === n.id);
              if (!middleNode) {
                continue;
              }
              for (const k of updateKeys) {
                if (k in middleNode) {
                  updatePackage[k] = middleNode[k];
                }
              }
            }
          }
        }
        // 更新node
        for (const k of updateKeys) {
          if (k in updatePackage) {
            node[k] = updatePackage[k];
          }
        }
        opeItem.shouldReComputeWhenAdd = false;
      });
    }
    if (opeItem.opeType === 'delete') {
      opeItem?.newNodes?.forEach((n) => {
        opeItem.moveOk = false;
        const { state: node } = this.checkNodeWithEditPipeline(n.id, opeItem) || {};
        if (!node) {
          return;
        }
        const trashTree = this.tree.getOriginTrashTree();
        if (trashTree.find((t) => t.id === node.id)) {
          // opeItem.shouldReComputeWhenAdd = true;
          console.error('节点已经存在于草稿箱');
          return;
        }
        // if (n.oldPID !== node.parentId) {
        //   console.error('节点的父节点和目标节点不一致');
        //   return;
        // }
        if (!this.cutNode(node, opeItem)) {
          return;
        }
        if (!isUndo) {
          n.oldPIDWhenMove = node.parentId;
          n.oldOffsetWhenMove = (this.tree.getNodeOffset(node.id) || -1) - 1;
        }
        node.parentId = 'trash';
        trashTree.unshift(node);
        opeItem.shouldReComputeWhenAdd = false;
        opeItem.moveOk = true;
      });
    }
    if (opeItem.opeType === 'move') {
      opeItem?.newNodes?.forEach((n) => {
        const { state: node } = this.checkNodeWithEditPipeline(n.id, opeItem) || {};
        opeItem.moveOk = false;
        if (!node) {
          return;
        }

        // if (node.parentId === n.parentId && node.parentId !== undefined) {
        //   console.warn('无移动');
        //   return;
        // }
        let dropToGap = false;
        const dropOffset = n.offset as number;
        const sameParent = node.parentId === n.parentId;
        if (dropOffset || dropOffset === 0) {
          dropToGap = true;
        }
        // if (node.parentId === n.parentId && !dropToGap) {
        //   console.warn('无移动');
        //   return;
        // }
        // if (n.oldPID !== node.parentId) {
        //   console.error('节点的父节点和目标节点不一致');
        //   return;
        // }
        // 判断是否形成环结构
        if (this.checkIfLoop(node, n.parentId)) {
          console.error('移动后产生了环');
          return;
        }

        // if (!n.parentId) {
        //   console.error('移动的父节点丢失');
        //   return;
        // }

        // 开始移动
        const newPID = n.parentId;
        let newPNode;
        if (newPID) {
          newPNode = this.store[newPID]?.state;
        }
        // const { state: newPNode } = newPID ? this.store[newPID] || {} : {};
        if (newPID && !newPNode) {
          // add后置位需要重新执行
          opeItem.shouldReComputeWhenAdd = true;
          console.error('目标节点缺失');
          return;
        }
        // move
        // offset
        const oldOffsetWhenMove = this.tree.getNodeOffset(node.id) || -1;
        if (sameParent) {
          if (dropOffset === oldOffsetWhenMove) {
            console.warn('移动前后offset相同');
            return;
          }
        }
        if (!this.cutNode(node, opeItem)) {
          return;
        }

        if (!isUndo) {
          n.oldPIDWhenMove = node.parentId;
          n.oldOffsetWhenMove = oldOffsetWhenMove;
        }

        node.parentId = newPID;
        if (newPNode) {
          if (dropToGap) {
            newPNode.children.splice(dropOffset, 0, node);
          } else if (this.opt.reverseOrder) {
            newPNode.children = [node, ...(newPNode.children || [])];
          } else {
            newPNode.children = [...(newPNode.children || []), node];
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (dropToGap) {
            this.tree.originTree.splice(dropOffset, 0, node);
          }else if (this.opt.reverseOrder) {
            this.tree.originTree.unshift(node);
          } else {
            this.tree.originTree.push(node);
          }
        }

        opeItem.shouldReComputeWhenAdd = false;
        opeItem.moveOk = true;
      });
    }
  }

  addNodeWithChildren(node: RTreeNode) {
    node?.children?.forEach((v) => loopNode(v, this.store));
  }

  // 判断移动的行为是否会造成环结构 newPid是否是node的祖先
  checkIfLoop(node: RTreeNode, newPID) {
    // 找pid
    let ancestor = this.store[newPID]?.state;

    while (ancestor && ancestor.id && ancestor.id !== node.id && ancestor.parentId) {
      ancestor = this.store[ancestor.parentId]?.state;
    }
    if (ancestor?.id === node.id) {
      return true;
    }
    return false;
  }

  checkIfInTrash(id: string) {
    return this.tree.getOriginTrashTree().find((v) => v.id === id);
  }

  // 2:从回收站回收的节点 不准确
  cutNode(node: RTreeNode, opeItem: OpeItem): 0 | 1 | 2 {
    // 顶层节点 推出originTree
    if (!node.parentId) {
      const idx = this.tree.originTree.findIndex((v) => v.id === node.id);
      if (idx !== -1) {
        this.tree.originTree.splice(idx, 1);
        return 1;
      }
      console.error('丢失节点的parentId信息');
      return 0;
    }
    const { state: pNode } = this.store[node.parentId as string] || {};
    if (!pNode) {
      opeItem.shouldReComputeWhenAdd = true;
      console.warn('父节点不在编辑树中？没想到这种场景出现的时间');
      return 0;
    } else {
      // 从originTree里移出
      const idx = pNode.children?.findIndex((v) => v.id === node.id);
      if (idx !== undefined && idx !== -1) {
        pNode.children?.splice(idx, 1);
      }
    }
    if (node.parentId === 'trash') return 2;
    return 1;
  }
  // 在store中插入opeItem return 位置索引
  addToStoreOpes(opes: OpeItem[], opeItem: OpeItem) {
    let locIndex = -1;
    for (let i = opes.length - 1; i >= 0; i--) {
      if (opes[i].id < opeItem.id) {
        locIndex = i;
        break;
      }
    }
    opes.splice(locIndex + 1, 0, opeItem);
    return locIndex;
  }
  // 检查节点是否存在和是否可以编辑的管道 只有存在和允许编辑才可以被加入单节点的记录里
  checkNodeWithEditPipeline(id: string, opeItem: OpeItem) {
    const storeNode = this.store[id];
    if (!storeNode) {
      opeItem.shouldReComputeWhenAdd = true;
      console.error('节点不在树上');
      return;
    }
    if (storeNode.state.editStatus === -1) {
      opeItem.shouldReComputeWhenAdd = false;
      console.error('节点无法编辑');
      return;
    }
    return storeNode;
  }

  split(opeItem: OpeItem, locNode: OpeItem) {
    if (!locNode.after) {
      console.error('非法插入');
      return;
    }
    const oldAfter = locNode.after;
    locNode.after = opeItem;
    opeItem.before = locNode;
    if (oldAfter) {
      opeItem.after = oldAfter;
      oldAfter.before = opeItem;
    }
  }

  iterReserveList(func) {
    let { last } = this;
    while (last && last.id !== 0) {
      func(last);
      last = last.before as OpeItem;
    }
  }

  findLoc(opeItem: OpeItem) {
    let locNode = this.last;
    while (locNode && locNode.before && opeItem.id < locNode.id) {
      locNode = locNode.before as OpeItem;
    }
    return locNode;
  }
}

export function loopNode(node, nodeMap: Store, parentNode?: any) {
  if (parentNode) {
    node.parentId = parentNode.id;
    // node._parentIds = `${parentNode._parentIds?`${parentNode._parentIds}|`:''}${parentNode.id}`;
  }
  nodeMap[node.id] = {
    state: node,
    opes: [],
  };
  if (node.children) {
    node.children.forEach((child) => {
      loopNode(child, nodeMap, node);
    });
  }
}

export interface HistoryItem {
  id: number; // 时间戳
  categoryId: string;
  operationType: 'add' | 'update' | 'move' | 'delete' | 'sync' | 'cover';
  receiveTime: number;
  isComplete: boolean;
  content: string;
}

class History {
  list: HistoryItem[];
  constructor(list: HistoryItem[] = []) {
    this.init(list);
  }
  init(list: HistoryItem[]) {
    this.list = list.sort((a, b) => b.receiveTime - a.receiveTime);
  }
  mergeItems(items: HistoryItem[]) {
    this.list = [...items, ...this.list];
    this.list = this.list.sort((a, b) => b.receiveTime - a.receiveTime);
  }
  push(item: HistoryItem) {
    if (!item) return;
    // 到序
    let ind = -1;
    const idx = this.list.findIndex((v) => v.id === item.id);
    if (idx !== -1) {
      this.list.splice(idx, 1, item);
      return;
    }
    for (let i = 0; i < this.list.length; i++) {
      if (item.receiveTime > this.list[i].receiveTime) {
        break;
      }
      ind = i;
    }
    this.list.splice(ind + 1, 0, item);
  }
  appendItems(items: HistoryItem[]) {
    this.list = [...this.list, ...items];
  }
  unshiftItems(items: HistoryItem[]) {
    this.list = [...items, ...this.list];
    this.list = [...this.list, ...items];
  }
  getList() {
    return this.list;
  }
  getLastItem() {
    return this.list[this.list.length - 1];
  }
}

// function addCss() {
//   const style = document.createElement('style');
//   const head = document.head || document.getElementsByTagName('head')[0];
//   style.type = 'text/css';
//   const textNode = document.createTextNode(cssText);
//   style.appendChild(textNode);
//   head.appendChild(style);
// }
// users
export interface UserItem {
  userId: string; // 时间戳
  userName?: string;
  location?: string;
  isOnline?: boolean;
}
function hasChild(ss) {
  const head = document.head || document.getElementsByTagName('head')[0];
  let ifHas = false;
  head.childNodes.forEach((v) => {
    if (v === ss) {
      ifHas = true;
    }
  });
  if (!ifHas) {
    head.appendChild(ss);
  }
}
const globalStyle = document.createElement('style');
globalStyle.type = 'text/css';

class Users {
  list: UserItem[];
  self: UserItem;
  style: HTMLStyleElement;
  prefix = 'loc';
  constructor(list: UserItem[] = [], opt: InitOpt) {
    this.init(list, opt);
  }

  init(list: UserItem[] = [], opt: InitOpt) {
    this.self = {
      userId: opt.userId,
    };
    if (!opt.style) {
      this.style = globalStyle;
    } else {
      this.style = opt.style;
    }
    if (opt.prefix) {
      this.prefix = opt.prefix;
    }
    hasChild(this.style);
    this.list = list.filter((v) => v.userId !== this.self.userId);
    this.updateStyle();
  }

  push(item: UserItem) {
    if (item.userId === this.self.userId) return;
    const idx = this.list.findIndex((v) => v.userId === item.userId);
    if (idx === -1) {
      this.list.push(item);
    } else {
      this.list[idx] = { ...this.list[idx], ...item };
    }
    this.updateStyle();
  }
  createCssText() {
    let text = '';
    this.list.forEach((v) => {
      if (v.isOnline && v.location && v.location !== '') {
        if (this.prefix === 'attrLoc') {
          text += `
          .attr_draggerble[data-index="${v.location}"] {
            color: #f7f7f7;
            background: #adadad;
          }
          `;
        } else {
          text += `
          .ds_draggeble[data-index="${v.location}"] {
            color: #f7f7f7;
            background: #adadad;
          }
          `;
        }

        if (this.prefix === 'loc') {
          text += `
            .ds_draggeble[data-index="${v.location}"]:after {
            content: '......编辑中';
            }
            `;
        }
      }
    });
    return text;
  }
  updateStyle() {
    this.style.innerHTML = this.createCssText();
  }
  onDestroy() {
    this.style.innerHTML = '';
    this.style.remove();
  }
}

// 需要一个容器存放游离节点，废弃 （改为操作无效化
// store：记录所有节点的操作
// setTree => {}

interface TreeProps {
  selectKeys?: string[];
  checkedKeys?: string[];
}
export class YTree {
  store: Store = {}; // 存储渲染节点
  operation: Operation;
  history: History; // 作为一个入口
  users: Users;
  originTree: any[];
  YTrashTree: any[]; // 统一加上根节点
  // setTree: Function;
  opt: InitOpt;

  treeProps: {
    selectKeys: string[];
    checkedKeys: string[];
  };

  constructor(tree: any[] = [], trashTree: any[] = [], opt: InitOpt = defaultOpt) {
    this.opt = mergeDefaultOpt(opt);
    this.init(tree, trashTree, opt);
    // this.setTree = setTree;
  }

  setTreeProps(params: TreeProps) {
    this.treeProps = { ...this.treeProps, ...params };
  }
  resetTreeProps() {
    this.treeProps = {
      selectKeys: [],
      checkedKeys: [],
    };
  }

  init(tree: any[], trashTree: any[], opt?: InitOpt) {
    this.opt = opt ? mergeDefaultOpt(opt) : this.opt;

    this.resetTreeProps();

    this.originTree = tree;
    this.wrapTrashNode(trashTree);
    this.YTrashTree = [
      {
        id: 'trash',
        name: 'trash',
        children: trashTree,
      },
    ];
    this.store = {};
    this.toNodeMap(tree);
    this.toNodeMap(this.YTrashTree);

    this.operation = new Operation(this, this.opt);
    this.history = new History();
    this.users = new Users([], this.opt);
  }
  getOriginTree(): RTreeNode[] {
    return this.originTree;
  }
  getOriginTrashTree(): RTreeNode[] {
    return this.YTrashTree[0].children || [];
  }

  wrapTrashNode(trashTree: any[]) {
    trashTree.forEach((element) => {
      element.parentId = 'trash';
    });
  }

  toNodeMap(tree) {
    tree.forEach((v) => loopNode(v, this.store));
  }

  getNode(id?: string) {
    if (!id) return;
    return this.store[id]?.state;
  }
  getNodeOffset(id?: string) {
    if (!id) return;
    if (!this.store[id]) return;
    const node = this.store[id].state;
    if (node.parentId) {
      const pNode = this.store[node.parentId].state;
      return pNode.children?.findIndex((v) => v.id === node.id);
    } else {
      return this.originTree.findIndex((v) => v.id === node.id);
    }
  }
  getPIds(id?: string) {
    if (!id) return;
    const ids: string[] = [];
    let ancestor = this.store[id]?.state;
    if (!ancestor) return;

    while (ancestor.id && ancestor.parentId) {
      ids.unshift(ancestor.parentId);
      ancestor = this.store[ancestor.parentId]?.state;
    }
    return ids;
  }
  getTowLevelKeys() {
    const keys: string[] = [];
    this.originTree.forEach((v) => {
      if(v.children?.length>0){
        keys.push(v.id);
      }
      v?.children?.forEach((vc) => {
        if(vc.children?.length>0){
          keys.push(vc.id);
        }
        // vc?.children?.forEach((vcc) => {
        //   keys.push(vcc.id);
        //   vcc?.children?.forEach((vccc) => {
        //     keys.push(vccc.id);
        //   });
        // });
      });
    });
    return keys;
  }
  onDestory() {
    this.users.onDestroy();
  }

  findParentIds(index?: string) {
    const node = this.getNode(index);
    if (!node) return;
    if (!node.parentId) return [];
    let ancestor = node;
    const pIds: any[] = [];
    while (ancestor.id && ancestor.parentId) {
      if (ancestor.parentId === 'trash') {
        return pIds;
      }
      if (!this.store[ancestor.parentId]) {
        return;
      }
      ancestor = this.store[ancestor.parentId]?.state;
      ancestor?.id && pIds.push(ancestor.id);
    }
    return pIds;
  }

  findIfInOriginTree(index?: string): boolean {
    const node = this.getNode(index);
    if (!node) return false;
    if (!node.parentId) return true;
    // 找pid
    let ancestor = node;

    while (ancestor.id && ancestor.parentId) {
      if (ancestor.parentId === 'trash') {
        return false;
      }
      if (!this.store[ancestor.parentId]) {
        return false;
      }
      ancestor = this.store[ancestor.parentId]?.state;
    }
    return true;
  }

  addChildren(index, n: RTreeNode[]) {
    const item = this.store[index];
    if (!item) return;
    if (item.state?.children && item.state.children.length > 0) return;
    n.forEach((v) => loopNode(v, this.store, item));
    item.state.children = n;
  }
}
