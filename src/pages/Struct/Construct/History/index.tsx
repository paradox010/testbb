import { useRef, useState } from 'react';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';
import dayjs from 'dayjs';
import type { HistoryItem, YTree as YTreeType } from '../Tree/node';

import styles from './index.module.less';
// import { useInfiniteScroll } from 'ahooks';
import { request } from 'ice';

import useInfiniteScroll from '@/components/useInfiniteScroll';
import { getParams } from '@/utils/location';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
  categoryId?: string;
}

async function getMoreList(lastId?: number, categoryId?: string) {
  if (!lastId) {
    console.error('没有最后一个节点');
    return {
      domainId: '',
      isNoMore: true,
    };
  }
  const domainId = getParams()?.domainId;
  const res = await request({
    url: '/api/standard/productOperationLog/more',
    method: 'get',
    params: {
      receiveTime: lastId,
      domainId,
      categoryId,
    },
  });
  return {
    list: res,
    isNoMore: res?.length < 20,
    domainId,
    receiveTime: lastId,
  };
}
const History: React.FC<TreeProps> = ({ treeMsg$, yTree, categoryId }) => {
  const [list, setList] = useState<HistoryItem[]>([] as any);

  const [isNoMore, setNoMore] = useState(true);

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshHistory') {
      setList([...yTree.history.getList()]);
      if (msg.ifInit) {
        setNoMore(false);
      }
    }
  });

  const loc = (event: React.MouseEvent<HTMLDivElement>) => {
    const { index } = event.currentTarget.dataset;
    if (!index) return;
    treeMsg$.emit({
      type: 'treePos',
      content: {
        id: index,
      },
    });
  };

  const ref = useRef<HTMLDivElement>(null);
  const { loadMore, loadingMore } = useInfiniteScroll(
    () => getMoreList(yTree.history.getLastItem()?.receiveTime, categoryId),
    {
      target: ref,
      isNoMore,
      onSuccess: (res) => {
        if (res.domainId !== getParams().domainId) {
          return;
        }
        if (yTree.history.getLastItem()?.receiveTime === res.receiveTime) {
          setNoMore(res.isNoMore);
          yTree.history.mergeItems(res.list);
          treeMsg$.emit({
            type: 'refreshHistory',
          });
        }
      },
    },
  );
  return (
    <div style={{ height: '100%', overflowY: 'auto' }} ref={ref}>
      <div className={styles.historyList}>
        <div className={styles.listHeader}>
          <div className={styles.date}>时间</div>
          <div className={styles.ope}>操作</div>
        </div>
        {list?.map((v) => (
          <div className={styles.item} key={v.id}>
            <div className={styles.date}>{dayjs(v.receiveTime).format('YYYY-MM-DD HH:mm')}</div>
            <div className={styles.ope} onClick={loc} data-index={v.categoryId}>
              <div className={styles.man}>
                操作人
                <span className={`ds_history_tag ${v.operationType}_tag`} />
              </div>
              <div>{v.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        {!isNoMore && (loadingMore ? '正在加载更多...' : '滚动加载更多')}
        {isNoMore && <span>没有更多历史记录</span>}
      </div>
    </div>
  );
};
export default History;
