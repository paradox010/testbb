import { useContext } from 'react';
import { request } from 'ice';

import RcTree from 'rc-tree';
import { Button } from 'antd';
import { useRequest } from 'ahooks';

import AttrRoute from '../Layout/AttrRoute';
import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';

import { StepProps, StepCompType, RTreeNode } from '../msg.d';
import styles from './rintro.module.less';
import { getTopKey } from '@/utils/tree';
import TimeDown from '@/components/TimeDown';

function findNext(list, id) {
  const idx = list.findIndex((v) => v.domainPubId === id);
  if (idx === -1) {
    return;
  }
  if (idx === list.length - 1) {
    return;
  }
  return list[idx + 1];
}
function findItem(list, id) {
  return list.find((v) => v.domainPubId === id);
}

async function getTree(params) {
  return await request({
    url: '/api/review/productCategoryPub/getTree',
    params,
  });
}

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const basic = useContext(BasicContext);

  const { proposalDomainId, proposalStartTime } = useSnapshot(stepState);

  const { data } = useRequest(() => getTree({ domainPubId: proposalDomainId }), {
    refreshDeps: [proposalDomainId],
  });

  const onDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = event.currentTarget.dataset;
    // const node = checkIfValid(index);
    // if (!node) return;
    // if (index === selectedKeys[0]) event.stopPropagation?.();
    stepMsg$.emit({
      type: 'route',
      path: 'attr',
      content: {
        id: index,
      },
    });
  };

  const nowDomain = findItem(basic.domainPreferred, proposalDomainId);

  // const renderFn2 = (nodeData, k?: string[]) => {
  //   if (!nodeData) return null;
  //   console.log(k && k.includes(nodeData.id))
  //   return (
  //     <RcTree.TreeNode
  //       isLeaf={!!nodeData.isLeaf}
  //       id={nodeData.id}
  //       expanded={k && k.includes(nodeData.id)}
  //       title={
  //         <div data-index={nodeData.id}>
  //           {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">???</span> : null}
  //           {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">???</span> : null}
  //           <span className="ds-nodeTitle">{nodeData.name}</span>
  //           <span title="????????????" className="ds-opeItem ds-detailOpe" onClick={onDetail} data-index={nodeData.id} />
  //         </div>
  //       }
  //       key={nodeData.id}
  //     >
  //       {nodeData.children && nodeData.children.map((v) => renderFn2(v))}
  //     </RcTree.TreeNode>
  //   );
  // };

  return (
    <div className={styles.content}>
      <div className={styles.subTitle}>
        <div>??????????????????{nowDomain?.userName}</div>
        <div>??????????????????{nowDomain?.companyName}</div>
        <div>
          ???????????????
          <TimeDown value={proposalStartTime || new Date().valueOf()} />
        </div>
        <div>?????????????????????{findNext(basic.domainPreferred, proposalDomainId)?.userName || '-'}</div>
      </div>
      <AttrRoute stepMsg$={stepMsg$} style={{ height: 'calc(100% - 56px)' }}>
        <div className="dsTree">
          {data ? (
            <RcTree<RTreeNode>
              fieldNames={{
                children: 'children',
                title: 'name',
                key: 'id',
              }}
              key={getTopKey(data).join('')}
              // height={treeHeight}
              // virtual={false}
              defaultExpandedKeys={getTopKey(data)}
              icon={false}
              treeData={data}
              titleRender={(nodeData) => (
                <div data-index={nodeData.id}>
                  {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">???</span> : null}
                  {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">???</span> : null}
                  {nodeData.editStatus === 3 ? <span className="ds-tree-title-delete">???</span> : null}
                  <span className="ds-nodeTitle">{nodeData.name}</span>
                  <span
                    title="????????????"
                    className="ds-opeItem ds-detailOpe"
                    onClick={onDetail}
                    data-index={nodeData.id}
                  />
                </div>
              )}
              motion={null}
            >
              {/* {data?.map((v) => renderFn2(v,getTopKey(data)))} */}
            </RcTree>
          ) : null}
        </div>
      </AttrRoute>
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  const goNext = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 4,
      },
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const basic = useContext(BasicContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { proposalDomainId } = useSnapshot(stepState);

  const goNextProp = () => {
    const item = findNext(basic.domainPreferred, proposalDomainId);
    if (!item) return;
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 3,
        isFirstProposal: false,
        proposalDomainId: item.domainPubId,
      },
    });
  };
  const goBefore = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 2,
      },
    });
  };
  return (
    <>
      ????????????
      {basic.self.userRole === '1' && (
        <>
          <Button type="primary" onClick={goNext}>
            ??????????????????
          </Button>
          <Button onClick={goNextProp} disabled={!findNext(basic.domainPreferred, proposalDomainId)}>
            ??????????????????
          </Button>
          {process.env.NODE_ENV === 'development' && <Button onClick={goBefore}>?????????</Button>}
        </>
      )}
    </>
  );
};

export default TypedStep;
