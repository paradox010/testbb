import RcTree from 'rc-tree';
import type { BasicDataNode } from 'rc-tree';
import { useCreation, useRequest } from 'ahooks';
import { useState } from 'react';

import { YTree } from '../../Construct/Tree/node';
import styles from './index.module.less';
import { request } from 'ice';

interface RTreeNode extends BasicDataNode {
  id: string;
  name: string;
  children?: RTreeNode[];
  isLeaf?: boolean;
  _isChecked?: boolean;
  isEnd?: boolean;
  path?: string;
}

// treeNode store, find parent;

async function getTree(params) {
  if (!params?.domainId) {
    return;
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
  return await request({
    url: '/api/standard/domain/getOptionalTree/children',
    method: 'post',
    data: params,
  });
}

function transDomain(params) {
  if (!params) return {};
  return { domainId: params.domainId, domainType: params.domainType };
}

const renderFn = (data: RTreeNode, _isChecked = false) => {
  if(!data) return null;
  const shouldCheck = _isChecked || data._isChecked;
  // console.log(data);
  return (
    <RcTree.TreeNode
      isLeaf={!!data?.isEnd}
      key={data.id}
      title={data.name}
      disableCheckbox={data._isChecked ? false : shouldCheck}
    >
      {data.children && data.children.map((v) => renderFn(v, shouldCheck))}
    </RcTree.TreeNode>
  );
};

const renderFn2 = (data: RTreeNode) => {
  if(!data) return null;
  return (
    <RcTree.TreeNode isLeaf={!!data?.isEnd} key={data.id} title={data.name}>
      {data.children && data.children.map((v) => renderFn2(v))}
    </RcTree.TreeNode>
  );
};

const TreeChoice = ({ domain, domainId, checkKeys, setCheckKeys}) => {
  const treeData = useCreation(
    () => ({
      ytree: new YTree(),
    }),
    [],
  );
  const [tree, setTree] = useState<RTreeNode[]>([]);
  const updateTree = () => {
    setTree([...treeData.ytree.getOriginTree()]);
  };

  useRequest(() => getTree(transDomain(domain)), {
    refreshDeps: [domainId],
    onSuccess: (res) => {
      treeData.ytree.init(res || [], []);
      setCheckKeys([])
      updateTree();
    },
  });

  // const [checkKeys, setCheckKeys] = useState([]);

  const onCheck = (ck, { checked, node }) => {
    const treeItem = treeData?.ytree?.store?.[node.key];
    if (!treeItem) return;
    const pIds = (treeItem?.state?.path || '').split('|');
    if (!pIds) {
      return;
    }
    let canCheck = true;
    pIds.pop();
    // 如果父节点被选中，子节点无法操作
    pIds.forEach((v) => {
      if (v !== '' && treeData.ytree.store[v].state._isChecked) {
        canCheck = false;
      }
    });
    if (!canCheck) return;

    // 和node相关的子将全部剔除
    let newCk = ck?.checked || [];
    if (checked) {
      newCk = newCk.filter((v) => {
        if (v === node.key) {
          return true;
        }
        const nn = treeData.ytree.store[v].state;
        if (nn.path?.split('|').includes(node.key)) {
          nn._isChecked = false;
          return false;
        }
        return true;
      });
    }
    treeItem.state._isChecked = checked;
    setCheckKeys(newCk);
  };

  const selectedTree = checkKeys.map((k) => treeData?.ytree?.store?.[k]?.state);

  const onLoadData = async (treeNode) => {
    if(!treeNode) return;
    if (treeNode.children) return;
    const res = await getTreeChildren({
      ...transDomain(domain),
      categoryId: treeNode.key,
    });
    treeData.ytree.addChildren(treeNode.key, res);
    treeData.ytree.store[treeNode.key].state.children = res;
    updateTree();
  };

  return (
    <div className={styles.choiceContent}>
      <div className={styles.choice}>
        <div className="dsTree" style={{ padding: '10px 0' }}>
          <RcTree<RTreeNode>
            fieldNames={{
              children: 'children',
              // key: 'id',
              // title: 'name',
            }}
            icon={false}
            motion={null}
            checkable
            checkedKeys={checkKeys}
            onCheck={onCheck}
            checkStrictly
            selectable={false}
            loadData={onLoadData}
          >
            {tree?.map((v) => renderFn(v))}
          </RcTree>
        </div>
      </div>
      <div className={styles.choice}>
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
            {selectedTree?.map((v) => renderFn2(v))}
          </RcTree>
        </div>
      </div>
    </div>
  );
};
export default TreeChoice;
