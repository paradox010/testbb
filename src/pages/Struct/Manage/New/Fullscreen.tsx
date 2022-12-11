import { Button, Modal } from 'antd';
import { useState } from 'react';
import styles from './index.module.less';

import RcTree from 'rc-tree';
import type { BasicDataNode, TreeNodeProps } from 'rc-tree';
import { request } from 'ice';
import { useRequest } from 'ahooks';
import { findNodeFromPath } from '@/utils/tree';

interface RTreeNode extends BasicDataNode {
  id: string;
  name: string;
  children?: RTreeNode[];
  isLeaf?: boolean;
  isEnd?: boolean;
  path?: string;
}

async function getTree(params) {
  if (!params?.domainId) {
    return;
  }
  if (!params.domainType) {
    return await request({
      url: '/api/standard/domain/getBaseTree',
      method: 'post',
      data: {
        mergeCategoryKey: params.domainId,
      },
    });
  }
  return await request({
    url: '/api/standard/domain/getOptionalTree',
    method: 'post',
    data: params,
  });
}

async function getTreeChildren(params) {
  if (!params?.domainId) {
    return;
  }
  if (!params.domainType) {
    return await request({
      url: '/api/standard/domain/getBaseTree/children',
      method: 'post',
      data: {
        mergeCategoryKey: params.domainId,
        categoryId: params.categoryId,
      },
    });
  }
  return await request({
    url: '/api/standard/domain/getOptionalTree/children',
    method: 'post',
    data: params,
  });
}

const RCTreeNode = RcTree.TreeNode as React.FC<TreeNodeProps<RTreeNode> & { path?: string }>;

const renderFn2 = (data: RTreeNode) => {
  if (!data) return null;
  return (
    <RCTreeNode path={data.path} isLeaf={!!data?.isEnd} id={data.id} title={data.name} key={data.id}>
      {data.children && data.children.map((v) => renderFn2(v))}
    </RCTreeNode>
  );
};

const Fullscreen: React.FC<{
  id?: string;
  name?: string;
  domainType?: string;
  noFullscreen?: boolean;
  versionTitle?: string;
}> = ({ id, name, domainType, noFullscreen = false, versionTitle = '基线' }) => {
  const [open, setOpen] = useState(false);
  const [tree, setTree] = useState<RTreeNode[]>([]);

  useRequest(
    () =>
      getTree({
        domainId: id,
        domainType,
      }),
    {
      refreshDeps: [id],
      onSuccess: (res) => {
        setTree(res);
      },
    },
  );

  const onLoadData = async (treeNode) => {
    if (!treeNode) return;
    if (treeNode.children) return;
    const res = await getTreeChildren({
      domainId: id,
      domainType,
      categoryId: treeNode.key,
    });
    const item = findNodeFromPath(treeNode.path, tree);
    if (!item) return;
    item.children = res;
    setTree([...tree]);
    // findkey
  };

  if (!id) return null;
  return (
    <div className={noFullscreen ? styles.afterMergeItem : styles.mergeItem} key={id}>
      {name && (
        <div className={styles.treeTitle}>
          {name}（{versionTitle}版本）
          {!noFullscreen && (
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              查看
            </Button>
          )}
        </div>
      )}
      <div className={styles.treeWrap}>
        <div className="dsTree">
          <RcTree<RTreeNode>
            fieldNames={{
              children: 'children',
            }}
            icon={false}
            motion={null}
            selectable={false}
            loadData={onLoadData}
          >
            {tree?.map((v) => renderFn2(v))}
          </RcTree>
        </div>
      </div>
      <Modal
        onCancel={() => {
          setOpen(false);
        }}
        open={open}
        footer={null}
        width={'70vw'}
        title={name}
        bodyStyle={{ minHeight: '80vh', maxHeight: '80vh', height: '80vh', padding: '10px 10px 10px 24px' }}
      >
        <div style={{ height: '100%', overflow: 'auto' }}>
          <div className="dsTree" style={{ padding: '10px 0' }}>
            <RcTree<RTreeNode>
              fieldNames={{
                children: 'children',
              }}
              icon={false}
              motion={null}
              selectable={false}
              loadData={onLoadData}
            >
              {tree?.map((v) => renderFn2(v))}
            </RcTree>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Fullscreen;
