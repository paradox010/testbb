import { LeftOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { request } from 'ice';
import Header from './Header';
import ShowTable from './ShowTable';

import styles from './index.module.less';

async function getAttr(params) {
  const resData = await request({
    url: '/api/review/productFeaturePub/getFeature',
    params,
  });
  return resData;
}

function Show({ id, back, type = 'page' }) {
  const { data } = useRequest(() =>
    getAttr({
      categoryPubId: id,
    }),
  );
  return (
    <div style={{ height: 'calc(100% - 56px)', overflow: 'auto' }}>
      {type === 'page' ? (
        <div className={styles.headerTitle}>
          <LeftOutlined onClick={back} />
          <span>详情</span>
        </div>
      ) : null}
      <Header data={data?.category || {}} />
      <ShowTable data={data?.currentFeature || []} />
    </div>
  );
}

export default Show;
