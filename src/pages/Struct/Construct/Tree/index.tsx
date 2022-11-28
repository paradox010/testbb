import { useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import RcTree from 'rc-tree';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';

import type { RTreeNode, YTree as YTreeType } from './node';

import {
  DeleteOutlined,
  DragOutlined,
  ExportOutlined,
  FileOutlined,
  FormOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';

import Search from './Search';

import styles from './index.module.less';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
}
const MyTree: React.FC<TreeProps> = ({ treeMsg$, yTree }) => {
  const [expandedKeys, setExpandedKeys] = useState([] as any[]);
  const [selectedKeys, setSelectedKeys] = useState([] as any[]);
  const [locKey, setLocKey] = useState(['', '']);
  const [treeData, setTree] = useState<RTreeNode[]>([] as any);
  const treeRef = useRef<RcTree<RTreeNode>>(null);

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshTree') {
      setTree([...yTree.getOriginTree()]);
      if (msg.autoExpand) {
        setExpandedKeys(yTree.getTowLevelKeys());
      }
    }
    if (msg.type === 'treePos') {
      // 定位
      // treeRef?.current?.scrollTo({ key: msg.content.id });
      const ids = yTree.getPIds(msg.content.id);
      if (!ids) {
        message.error('节点不存在树上');
        return;
      }
      if (ids?.[0] === 'trash') {
        message.warn('该节点在回收站中');
        return;
      }
      setSelectedKeys([msg.content.id]);
      if (ids.length) {
        setExpandedKeys((prev) => Array.from(new Set([...prev, ...ids])));
      }
      setLocKey([msg.content.id, Date().valueOf()]);
    }
  });

  useEffect(() => {
    treeRef.current?.scrollTo({ key: locKey[0], align: 'top' });
  }, [locKey]);

  useEffect(() => {
    treeMsg$.emit({
      type: 'user',
      content: {
        location: selectedKeys[0] || '',
        isOnline: true,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  const onAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 这里dom上的都会做string处理
    const { index } = event.currentTarget.dataset;
    const node = checkIfValid(index, true);
    if (!node) return;
    if (index === selectedKeys[0]) event.stopPropagation?.();
    treeMsg$.emit({
      type: 'modal',
      open: 'add',
      modalData: node,
    });
  };
  const checkIfValid = (index, noNeed = false) => {
    if (!index) return;
    const { id, name, description, editStatus } = yTree.getNode(index) || {};
    if (!id) return;
    if (!noNeed && editStatus === -1) {
      message.warn('该节点无法编辑');
      return;
    }
    return { id, name, description };
  };
  const onUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    const node = checkIfValid(index);
    if (!node) return;
    if (index === selectedKeys[0]) event.stopPropagation?.();
    treeMsg$.emit({
      type: 'modal',
      open: 'update',
      modalData: node,
    });
  };
  const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    const node = checkIfValid(index);
    if (!node) return;
    if (index === selectedKeys[0]) event.stopPropagation?.();
    treeMsg$.emit({
      type: 'modal',
      open: 'delete',
      modalData: node,
    });
  };
  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    const node = checkIfValid(index);
    if (!node) return;
    if (index === selectedKeys[0]) event.stopPropagation?.();
    treeMsg$.emit({
      type: 'modal',
      open: 'move',
      modalData: node,
    });
  };
  const onDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    const node = checkIfValid(index);
    if (!node) return;
    if (index === selectedKeys[0]) event.stopPropagation?.();
    treeMsg$.emit({
      type: 'route',
      path: 'attr',
      content: {
        id: index,
      },
    });
  };

  // const onDrop = (info) => {
  //   const dropKey = info.node.props.eventKey;
  //   const dragkey = info.dragNode.props.eventKey;
  //   const dropNode = yTree.getNode(dropKey);
  //   const dragNode = yTree.getNode(dragkey);
  //   if (dragNode?.editStatus === -1) {
  //     message.warn('该节点无法编辑');
  //     return;
  //   }
  //   treeMsg$.emit({
  //     type: 'modal',
  //     open: 'move_confirm',
  //     modalData: { id: dragNode?.id, name: dragNode?.name, parentId: dropNode?.id, parentName: dropNode?.name },
  //   });
  // };

  const onDragStart = (event) => {
    const { index } = event.currentTarget.dataset;
    event.dataTransfer.setData('drag_id', index);
    event.target.classList.add('dragging');
  };
  const onDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  // drop targets
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDragEnter = (event) => {
    if (event.target.classList.contains('ds_draggeble')) {
      event.target.classList.add('dragover');
    }
  };
  const onDragLeave = (event) => {
    if (event.target.classList.contains('ds_draggeble')) {
      event.target.classList.remove('dragover');
    }
  };
  const onDrop = (event) => {
    event.preventDefault();
    if (!event.target?.classList?.contains('ds_draggeble')) {
      return;
    }
    event.target.classList.remove('dragover');
    if (!event.target?.dataset?.index) {
      return;
    }
    const dragkey = event.dataTransfer.getData('drag_id');
    const dropKey = event.target.dataset.index;
    const dragNode = yTree.getNode(dragkey);
    const dropNode = yTree.getNode(dropKey);
    if (dragNode?.editStatus === -1) {
      message.warn('该节点无法编辑');
      return;
    }
    treeMsg$.emit({
      type: 'modal',
      open: 'move_confirm',
      modalData: { id: dragNode?.id, name: dragNode?.name, parentId: dropNode?.id, parentName: dropNode?.name },
    });
  };

  const onOutOpe = (ope = 'update') => {
    if (!selectedKeys?.[0]) return;
    if (!yTree.findIfInOriginTree(selectedKeys[0])) return;
    const monitorE = { currentTarget: { dataset: { index: selectedKeys[0] } } } as any;
    if (ope === 'update') {
      onUpdate(monitorE);
    }
    if (ope === 'add') {
      onAdd(monitorE);
    }
    if (ope === 'detail') {
      onDetail(monitorE);
    }
    if (ope === 'move') {
      onMove(monitorE);
    }
    if (ope === 'delete') {
      onDelete(monitorE);
    }
  };

  const onSearchSelect = (_, v) => {
    treeMsg$.emit({
      type: 'treePos',
      content: {
        id: v.value,
      },
    });
  };

  return (
    <>
      <div className={styles.treeTool}>
        <Search onSelect={onSearchSelect} />
        <Button icon={<FormOutlined />} onClick={() => onOutOpe()}>
          编辑
        </Button>
        <Button icon={<ExportOutlined />}>导入</Button>
        <Button icon={<PlusSquareOutlined />} onClick={() => onOutOpe('add')}>
          增子节点
        </Button>
        <Button icon={<FileOutlined />} onClick={() => onOutOpe('detail')}>
          查看详情
        </Button>
        <Button icon={<DragOutlined />} onClick={() => onOutOpe('move')}>
          移动节点
        </Button>
        <Button icon={<DeleteOutlined />} onClick={() => onOutOpe('delete')}>
          删除
        </Button>
      </div>
      <div className="dsTree" style={{ height: 'calc(100% - 76px)' }}>
        <RcTree<RTreeNode>
          ref={treeRef}
          fieldNames={{
            children: 'children',
            title: 'name',
            key: 'id',
          }}
          icon={false}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedKeys}
          onSelect={setSelectedKeys}
          treeData={treeData}
          titleRender={(nodeData) => (
            <div
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              data-index={nodeData.id}
              className="ds_draggeble"
              draggable={nodeData.editStatus !== -1}
            >
              <span className="ds-nodeTitle">{nodeData.name}</span>
              <span title="编辑节点" className="ds-opeItem ds-editOpe" onClick={onUpdate} data-index={nodeData.id} />
              <span title="新增子节点" className="ds-opeItem ds-addOpe" onClick={onAdd} data-index={nodeData.id} />
              <span title="查看详情" className="ds-opeItem ds-detailOpe" onClick={onDetail} data-index={nodeData.id} />
              <span title="移动节点" className="ds-opeItem ds-moveOpe" onClick={onMove} data-index={nodeData.id} />
              <span title="删除节点" className="ds-opeItem ds-deleteOpe" onClick={onDelete} data-index={nodeData.id} />
            </div>
          )}
          motion={null}
          defaultExpandAll
          virtual={false}
          // height={800}
          // itemHeight={32}
        />
      </div>
    </>
  );
};
export default MyTree;
