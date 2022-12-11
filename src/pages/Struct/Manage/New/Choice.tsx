import { Button, message, Select } from 'antd';
import { useRequest } from 'ahooks';
import { useState } from 'react';

import baseState from './state';
import { request } from 'ice';

import TreeChoice from './TreeChoice';
import { getParams } from '@/utils/location';

import styles from './index.module.less';

async function getOptions(params) {
  return request({
    url: '/api/standard/domain/listBaseOptional',
    params,
  });
}

async function initStandard(params) {
  return request({
    url: '/api/standard/domain/pickBase',
    method: 'post',
    data: params,
  });
}

const Choice = () => {
  const [selectDomain, setSD] = useState();
  const { data: selectOption } = useRequest(() => getOptions({ domainId: getParams()?.domainId }), {
    onSuccess: (res) => {
      if (res?.[0]) {
        setSD(res?.[0]?.domainId);
      }
    },
  });

  const item = selectOption?.find((v) => v.domainId === selectDomain);

  const [checkKeys, setCheckKeys] = useState([]);

  const { run, loading } = useRequest(initStandard, {
    manual: true,
    onSuccess: (res) => {
      baseState.mergeCategoryKey = res.mergeCategoryKey;
      baseState.mergeFeatureKey = res.mergeFeatureKey;
      baseState.step = 'merge';
    },
  });
  const onOk = () => {
    if (!item.domainId) return;
    if (checkKeys?.length === 0) {
      message.warn('请选择节点');
      return;
    }
    run({
      domainId: item.domainId,
      domainType: item.domainType,
      categoryId: checkKeys,
    });
  };

  return (
    <>
      <div style={{ padding: '10px 20px' }}>
        选择您的基线参考版本
        <Select
          value={selectDomain}
          onChange={setSD}
          style={{ width: 300, marginLeft: 10 }}
          options={selectOption?.map((v) => ({ label: v.name, value: v.domainId })) || []}
        />
      </div>
      <TreeChoice domain={item} domainId={selectDomain} checkKeys={checkKeys} setCheckKeys={setCheckKeys} />
      <div className={styles.bottomBtn}>
        <Button
          onClick={() => {
            baseState.step = 'name';
          }}
        >
          上一步
        </Button>
        <Button
          onClick={onOk}
          type="primary"
          style={{ marginLeft: 20 }}
          disabled={!item}
          loading={loading}
        >
          确定
        </Button>
      </div>
    </>
  );
};
export default Choice;
