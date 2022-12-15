import { getParams } from '@/utils/location';
import { SwapRightOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Select, Button } from 'antd';
import { request, history } from 'ice';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

import Fullscreen from './Fullscreen';

import styles from './index.module.less';
import baseState from './state';

async function getOptions(params) {
  return request({
    url: '/api/standard/domain/listOptional',
    params,
  });
}

async function merge(params) {
  return request({
    url: '/api/standard/domain/merge',
    method: 'post',
    data: params,
  });
}

async function build(params) {
  return request({
    url: '/api/standard/domain/init',
    method: 'post',
    data: params,
  });
}

const Merge = () => {
  const state = useSnapshot(baseState);

  const [selectDomain, setSD] = useState([]);
  const { data: selectOption } = useRequest(() => getOptions({ domainId: getParams()?.domainId }), {});

  const { run: goMerge, loading: mergeLoading } = useRequest(merge, {
    manual: true,
    onSuccess: (res) => {
      baseState.afterMerge = {
        mergeCategoryKey: res.mergeCategoryKey,
        mergeFeatureKey: res.mergeFeatureKey,
      };
    },
  });
  const onMerge = () => {
    const mergeList = selectDomain
      .map((k) => selectOption.find((v) => v.domainId === k))
      .filter((v) => ({
        domainId: v.domainId,
        domainType: v.domainType,
      }));
    goMerge({
      mergeList,
      mergeCategoryKey: state.mergeCategoryKey,
      mergeFeatureKey: state.mergeFeatureKey,
    });
  };

  const { run: goBuild, loading: buildLoading } = useRequest(build, {
    manual: true,
    onSuccess: (res) => {
      history?.push('/kstruct/kmanage/klist');
    },
  });

  const onBuild = () => {
    let newp = {
      mergeCategoryKey: state.mergeCategoryKey,
      mergeFeatureKey: state.mergeFeatureKey,
    };
    if (state.afterMerge) {
      newp = {
        mergeCategoryKey: state.afterMerge.mergeCategoryKey,
        mergeFeatureKey: state.afterMerge.mergeFeatureKey,
      };
    }
    goBuild({
      domainId: getParams()?.domainId,
      ...newp,
    });
  };

  return (
    <>
      <div className={styles.selectWrap}>
        选择您想融合的参考版本：
        <Select
          mode="multiple"
          value={selectDomain}
          onChange={setSD}
          style={{ width: 300, marginLeft: 10 }}
          options={selectOption?.map((v) => ({ label: v.name, value: v.domainId })) || []}
        />
      </div>
      <div className={styles.mergeContent}>
        <div className={styles.merge1}>
          <Fullscreen key={state.mergeCategoryKey} name={state.name} id={state.mergeCategoryKey || ''} />
          {selectDomain?.map((k) => (
            <Fullscreen
              id={k}
              key={k}
              versionTitle="参考"
              domainType={selectOption.find((v) => v.domainId === k)?.domainType}
              name={selectOption.find((v) => v.domainId === k)?.name}
            />
          ))}
        </div>
        <div className={styles.merge2}>
          {state.afterMerge ? (
            <div>
              <Button
                onClick={() => {
                  baseState.afterMerge = undefined;
                }}
              >
                回退
              </Button>
              <Button type="primary" onClick={onBuild} loading={buildLoading}>
                建立
              </Button>
            </div>
          ) : (
            <div>
              <Button type="primary" style={{ height: 'auto' }} onClick={onMerge} loading={mergeLoading}>
                <div>确定</div>
                <div>融合</div>
              </Button>
              <SwapRightOutlined />
            </div>
          )}
        </div>
        <div className={styles.merge3}>
          <Fullscreen
            versionTitle="融合"
            noFullscreen
            key={state.afterMerge?.mergeCategoryKey}
            name={state.name}
            id={state.afterMerge?.mergeCategoryKey}
          />
        </div>
      </div>
    </>
  );
};

export default Merge;
