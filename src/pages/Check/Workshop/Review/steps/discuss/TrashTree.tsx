import { useState, useRef } from 'react';

import RcTree from 'rc-tree';
import { StepProps, RTreeNode } from '../../msg.d';
import { useUpdate } from 'ahooks';

const TrashTree: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const treeRef = useRef<RcTree<RTreeNode>>(null);
  const update = useUpdate();
  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshTree') {
      // setTree([...yTree.getOriginTrashTree()]);
      update();
    }
  });

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    if (!index) return;
    const { id, name, description } = msgData.yTree.getNode(index) || {};
    stepMsg$.emit({
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

  console.log('trash rendering', msgData?.yTree?.getOriginTrashTree());

  return (
    <div className="dsTree" style={{ height: '100%' }}>
      <RcTree<RTreeNode>
        ref={treeRef}
        treeData={msgData?.yTree?.getOriginTrashTree()}
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
            <span title="移动节点" className="ds-opeItem ds-moveOpe" onClick={onMove} data-index={nodeData.id} />
          </div>
        )}
        motion={null}
      />
    </div>
  );
};
export default TrashTree;
