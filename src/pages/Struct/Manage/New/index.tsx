import { Button, Typography } from 'antd';
import { history, useLocation } from 'ice';

import baseState, { init } from './state';
import { useSnapshot } from 'valtio';

import StepFirst from './StepFirst';
import LocalImport from './LocalImport';

import styles from './index.module.less';
import ImportView from './ImportView';
import Merge from './Merge';
import { useUnmount } from 'ahooks';
import BackTitle from '@/components/BackTitle';
import Choice from './Choice';
import { useEffect } from 'react';
import { getParams } from '@/utils/location';

const New = () => {
  const state = useSnapshot(baseState);

  useUnmount(() => {
    init();
  });

  // useEffect(() => {
  //   window.onbeforeunload = function (e) {
  //     (window.event || e).returnValue = '确定离开当前页面吗？';
  //   };
  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);

  useEffect(() => {
    baseState.domainId = getParams()?.domainId;
    baseState.name = getParams()?.domainName;
  }, []);

  return (
    <>
      <BackTitle
        title={state.step === 'merge' ? '版本融合' : '构建基线版本'}
        back={() => {
          history?.push('/kstruct/kmanage/klist');
        }}
        tooltip={{ title: '知识构建' }}
        style={{ fontSize: 18 }}
      />
      <div className={styles.main}>
        <div className={styles.pageHeader}>
          <span style={{ marginRight: 12, color: '#000' }}>域名称：</span>
          <Typography.Paragraph
            // editable={{
            //   onChange: (v) => {
            //     baseState.name = v;
            //   },
            //   triggerType: ['icon', 'text'],
            // }}
            style={{ display: 'inline-block', minWidth: 500, marginBottom: 0 }}
          >
            {state.name}
          </Typography.Paragraph>
          {(state.step === 'import' || state.step === 'importView') && (
            <Button style={{ float: 'right' }}>
              <a download href="https://file.dvolution.com/file/product-knowledge-management/template/%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BFv1.0.xlsx">
                模板下载
              </a>
            </Button>
          )}
        </div>
        {state.step === 'name' && <StepFirst />}
        {state.step === 'import' && <LocalImport />}
        {state.step === 'importView' && <ImportView />}
        {state.step === 'merge' && <Merge />}
        {state.step === 'choice' && <Choice />}
      </div>
    </>
  );
};

export default New;
