import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { StepProps } from '../msg.d';
import { Badge } from 'antd';

import dayjs from 'dayjs';

import styles from './index.module.less';
import { request } from 'ice';
import useInfiniteScroll from '@/components/useInfiniteScroll';
import { useContext, useRef, useState } from 'react';

async function getMoreList(lastId?: number, reviewId?: string) {
  if (!lastId) {
    console.error('没有最后一个节点');
    return {
      reviewId: '',
      isNoMore: true,
    };
  }
  const res = await request({
    url: '/api/review/reviewRecord/more',
    method: 'get',
    params: {
      receiveTime: lastId,
      reviewId,
    },
  });
  return {
    list: res,
    isNoMore: res?.length < 20,
    reviewId,
    receiveTime: lastId,
  };
}

const Record: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const basic = useContext(BasicContext);

  const { record } = useSnapshot(stepState);

  const loc = (item) => {
    if (item.recordType === 'operation') {
      stepMsg$.emit({
        type: 'treePos',
        content: {
          id: item.categoryId,
        },
      });
    }
  };

  const [isNoMore, setNoMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { loadMore, loadingMore } = useInfiniteScroll(
    () => getMoreList(record?.[record.length - 1]?.receiveTime, basic.id),
    {
      target: ref,
      isNoMore,
      onSuccess: (res) => {
        if (res.reviewId !== basic.id) {
          return;
        }
        if (record[record.length - 1]?.receiveTime === res.receiveTime) {
          setNoMore(res.isNoMore);
          res.list.forEach((v) => {
            stepState.record.push(v);
          });
        }
      },
    },
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} ref={ref}>
      {record?.map((v) => (
        <div className={styles.item} key={v.id}>
          <div className={styles.date}>{dayjs(v.createTime).format('HH:mm')}</div>
          <Badge color="blue" />
          <div className={styles.ope} onClick={() => loc(v)}>
            <div className={styles.man}>{v.userName}</div>
            <div>{v.content}</div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        {!isNoMore && (loadingMore ? '正在加载更多...' : '滚动加载更多')}
        {isNoMore && <span>没有更多历史记录</span>}
      </div>
    </div>
  );
};
export default Record;
