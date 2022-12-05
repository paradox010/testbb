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

  const { proposalDomainId } = useSnapshot(stepState);

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

  const nowDomain = findItem(basic.domain, proposalDomainId);
  return (
    <div className={styles.content}>
      <div className={styles.subTitle}>
        <div>当前演讲人：{nowDomain?.userName}</div>
        <div>演讲人公司：{nowDomain?.companyName}</div>
        <div>演讲时间：</div>
        <div>下一位演讲人：{findNext(basic.domain, proposalDomainId)?.userName}</div>
      </div>
      <AttrRoute stepMsg$={stepMsg$} style={{ height: '100%' }}>
        <div className="dsTree">
          <RcTree<RTreeNode>
            fieldNames={{
              children: 'children',
              title: 'name',
              key: 'id',
            }}
            // height={treeHeight}
            // virtual={false}
            icon={false}
            treeData={data || []}
            titleRender={(nodeData) => (
              <div data-index={nodeData.id}>
                {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">增</span> : null}
                {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">改</span> : null}
                <span className="ds-nodeTitle">{nodeData.name}</span>
                <span
                  title="查看详情"
                  className="ds-opeItem ds-detailOpe"
                  onClick={onDetail}
                  data-index={nodeData.id}
                />
              </div>
            )}
            motion={null}
          />
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
    const item = findNext(basic.domain, proposalDomainId);
    if (!item) return;
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 3,
        isFirstProposal: false,
        proposalDomainId: item.id,
      },
    });
  };
  return (
    <>
      提议介绍
      <Button type="primary" onClick={goNext}>
        进入提议讨论
      </Button>
      <Button onClick={goNextProp} disabled={!findNext(basic.domain, proposalDomainId)}>
        下一位演讲人
      </Button>
    </>
  );
};

export default TypedStep;
