import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { StepProps } from '../msg.d';
import { Badge, Button, Popover } from 'antd';

import dayjs from 'dayjs';

import { request } from 'ice';
import useInfiniteScroll from '@/components/useInfiniteScroll';
import { useContext, useRef, useState } from 'react';

import styles from './index.module.less';
import { ExclamationCircleFilled } from '@ant-design/icons';

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

  const [trigger, setTrigger] = useState('');
  const onClose = () => {
    setTrigger('');
  };
  const handleObject = (recordId)=>{
    stepMsg$.emit({
      type: 'objection',
      content: {
        recordId
      }
    })
    onClose();
  }

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
        <div className={styles.item} key={v.id} style={{ position: 'relative' }}>
          <div className={styles.date}>{dayjs(v.receiveTime).format('HH:mm')}</div>
          <Badge color="blue" />
          <div className={styles.ope} onClick={() => loc(v)}>
            <div className={styles.man}>{v.userName}</div>
            <div>{v.content}</div>
          </div>
          {v.recordType === 'operation' && (
            <Popover
              destroyTooltipOnHide
              getPopupContainer={(node) => node.parentNode as HTMLElement}
              trigger="click"
              placement="topRight"
              open={trigger === v.id}
              onOpenChange={(open) => setTrigger(open ? v.id : '')}
              content={
                <div className={styles.objectionModal}>
                  <div className={styles.titleWrap}>
                    <ExclamationCircleFilled />
                    <div>
                      <div className={styles.title}>发起异议</div>
                      <div className={styles.content}>您是否对“{v.content}”提出异议？</div>
                    </div>
                  </div>
                  <div className={styles.objectionLabel}>
                    异议功能可帮助您匿名对您不同意的修订操作申请发起全员投票；为避免会议进程收到非必要干扰，您有两次匿名异议全，三次或三次以上异议需要您进行发言以表达您的观点看法。
                  </div>
                  <div className={styles.buttons}>
                    <Button onClick={onClose}>取消</Button>
                    <Button type="primary" onClick={()=>handleObject(v.id)}>确定</Button>
                  </div>
                </div>
              }
            >
              <span title="发起异议" className="ds-objectionOpe" />
            </Popover>
          )}
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
