import { useState } from 'react';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';
import dayjs from 'dayjs';
import type { HistoryItem, YTree as YTreeType } from '../Tree/node';

import styles from './index.module.less';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
}
const History: React.FC<TreeProps> = ({ treeMsg$, yTree }) => {
  const [list, setList] = useState<HistoryItem[]>([] as any);

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshHistory') {
      setList([...yTree.history.getList()]);
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
  console.log(list);
  return (
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
  );
};
export default History;
