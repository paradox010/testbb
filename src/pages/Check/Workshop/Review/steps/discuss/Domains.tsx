import { useRequest } from 'ahooks';
import { Modal, Select } from 'antd';
import { request } from 'ice';
import { useContext, useState } from 'react';
import BasicContext from '../../basicContext';
import { StepProps, RTreeNode } from '../../msg.d';
import RcTree from 'rc-tree';
import Attr from '../Attr/Show';
import { getTopKey } from '@/utils/tree';

async function getTree(params) {
  return await request({
    url: '/api/review/productCategoryPub/getTree',
    params,
  });
}

const Domains: React.FC<StepProps & { editable?: boolean }> = ({ stepMsg$, msgData, editable = true }) => {
  const { domain } = useContext(BasicContext);
  const [select, setSelect] = useState(domain?.[0] ? domain[0].domainPubId : '');
  return (
    <>
      <div style={{ padding: '10px 20px' }}>
        <Select
          style={{ width: '100%' }}
          value={select}
          onSelect={setSelect}
          options={domain?.map((v) => ({
            value: v.domainPubId,
            label: `${v.domainName} V${v.version}`,
          }))}
        />
      </div>
      {domain?.map((v) => (
        <div
          key={v.domainPubId}
          style={{ display: select === v.domainPubId ? 'block' : 'none', height: 'calc(100% - 52px)' }}
        >
          <DomainTree stepMsg$={stepMsg$} msgData={msgData} id={v.domainPubId} editable={editable} />
        </div>
      ))}
    </>
  );
};

const DomainTree: React.FC<StepProps & { id: string; editable?: boolean }> = ({ stepMsg$, msgData, id, editable }) => {
  const { data } = useRequest(() => getTree({ domainPubId: id }));
  const onDragStart = (event) => {
    const { index, name, haschildren } = event.currentTarget.dataset;
    event.dataTransfer.setData('drag_id', index);
    event.dataTransfer.setData('drag_from', 'domain');
    event.dataTransfer.setData(
      'drag_content',
      JSON.stringify({
        name,
        domainPubId: id,
        hasChildren: Boolean(Number(haschildren)),
      }),
    );
    event.target.classList.add('dragging');
  };
  const onDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  const onMove = (item, type: 'sync' | 'cover' = 'sync') => {
    if (item.editStatus === -1) return;
    if (!item?.id) return;
    stepMsg$.emit({
      type: 'modal',
      open: type,
      modalData: { id: item.id, name: item.name, domainPubId: id },
    });
  };

  const [detail, setD] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
    id: '',
  });

  const onDetail = (item) => {
    setD({
      open: true,
      id: item.id,
    });
  };

  return (
    <div className="dsTree">
      {data && (
        <RcTree<RTreeNode>
          fieldNames={{
            children: 'children',
            title: 'name',
            key: 'id',
          }}
          // height={treeHeight}
          // virtual={false}
          icon={false}
          treeData={data}
          defaultExpandedKeys={getTopKey(data)}
          titleRender={(nodeData) => (
            <div
              data-index={nodeData.id}
              data-name={nodeData.name}
              data-haschildren={(nodeData.children?.length || 0) > 0 ? 1 : 0}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              draggable={nodeData.editStatus !== -1 && editable}
              className="ds_draggeble"
            >
              {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">增</span> : null}
              {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">改</span> : null}
              {nodeData.editStatus === 3 ? <span className="ds-tree-title-delete">删</span> : null}
              <span className="ds-nodeTitle">{nodeData.name}</span>
              {editable && (
                <>
                  <span
                    title="覆盖节点"
                    className="ds-opeItem ds-coverOpe"
                    onClick={() => onMove(nodeData, 'cover')}
                    data-index={nodeData.id}
                  />
                  <span
                    title="移动节点"
                    className="ds-opeItem ds-moveOpe"
                    onClick={() => onMove(nodeData)}
                    data-index={nodeData.id}
                  />
                </>
              )}

              <span
                title="查看详情"
                className="ds-opeItem ds-detailOpe"
                onClick={() => onDetail(nodeData)}
                data-index={nodeData.id}
              />
            </div>
          )}
          motion={null}
        />
      )}
      <Modal
        onCancel={() => {
          setD({ open: false });
        }}
        width={1000}
        open={detail.open}
        destroyOnClose
        title="节点详情"
        bodyStyle={{ padding: '0 0 10px 0', minHeight: 500 }}
        footer={null}
      >
        <Attr id={detail.id} back={() => {}} type="modal" />
      </Modal>
    </div>
  );
};

export default Domains;
