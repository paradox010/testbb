import { useState, useRef } from 'react';

import RcTree from 'rc-tree';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';

import type { RTreeNode, YTree as YTreeType } from '../Tree/node';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
}
const TrashTree: React.FC<TreeProps> = ({ treeMsg$, yTree }) => {
  const [treeData, setTree] = useState<RTreeNode[]>([] as any);
  const treeRef = useRef<RcTree<RTreeNode>>(null);
  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshTree') {
      setTree([...yTree.getOriginTrashTree()]);
    }
  });

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    if (!index) return;
    const { id, name, description } = yTree.getNode(index) || {};
    treeMsg$.emit({
      type: 'modal',
      open: 'move',
      modalData: { id, name, description },
    });
  };

  const onDragStart = (event) => {
    const { index } = event.currentTarget.dataset;
    event.dataTransfer.setData('drag_id', index);
    event.target.classList.add('dragging');
  };
  const onDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  console.log('trash rendering');

  return (
    <div className="dsTree" style={{ height: '100%' }}>
      <RcTree<RTreeNode>
        ref={treeRef}
        treeData={treeData}
        fieldNames={{
          children: 'children',
          title: 'name',
          key: 'id',
        }}
        titleRender={(nodeData) => (
          <div
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            data-index={nodeData.id}
            className="ds_draggeble"
            draggable={nodeData.editStatus !== -1}
          >
            <span className="ds-nodeTitle">{nodeData.name}</span>
            <span
              title="移动节点"
              className="ds-opeItem ds-moveOpe"
              onClick={onMove}
              data-index={nodeData.id}
            />
          </div>
        )}
        motion={null}
      />
    </div>
  );
};
export default TrashTree;
