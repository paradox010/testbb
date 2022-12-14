import { Button, Input, message, Popover } from 'antd';
import type { InputRef } from 'antd';
import { useRef, useState } from 'react';

import VoteModal from './Modal';
import { StepProps } from '../../msg.d';
import { useUpdate } from 'ahooks';

const DiscussTitle: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [click, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const inputRef = useRef<InputRef>(null);
  const onOpenChange = (open) => {
    setClicked(open);
    if (open) {
      setTimeout(() => {
        inputRef?.current?.focus();
      });
    }
  };
  const onClose = () => {
    setValue('');
    setClicked(false);
  };
  const update = useUpdate();

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshVote') {
      update();
    }
  });
  const onCreateVote = () => {
    stepMsg$.emit({
      type: 'compVote',
      content: {
        type: 1,
        content: value,
      },
    });
    // loading;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValue('');
      setClicked(false);
    }, 500);
  };

  const goNext = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 5,
      },
    });
  };
  const goBefore = () => {
    if (!(msgData?.voteCenter?.getLatest() || { isFinished: true }).isFinished) {
      message.warn('请结束当前投票后再进入下一阶段');
      return;
    }
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 2,
      },
    });
  };

  const content = (
    <div>
      <div>投票问题</div>
      <Input.TextArea
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={inputRef}
        autoSize={{ minRows: 3, maxRows: 10 }}
        allowClear
      />
      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <Button style={{ marginRight: 6 }} onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onCreateVote} loading={loading}>
          开始投票
        </Button>
      </div>
    </div>
  );
  return (
    <>
      提议讨论
      {msgData.self.userRole === '1' && (
        <>
          <Button type="primary" onClick={goNext}>
            编辑结束
          </Button>
          {process.env.NODE_ENV === 'development' && <Button onClick={goBefore}>上一步</Button>}
        </>
      )}
      {msgData.self.userRole === '4' && (
        <>
          <Popover
            open={click}
            onOpenChange={onOpenChange}
            overlayStyle={{ width: 300 }}
            placement="bottomRight"
            content={content}
            trigger="click"
            className="ds-pop ds-right"
          >
            <Button disabled={!(msgData?.voteCenter?.getLatest() || { isFinished: true }).isFinished}>发起投票</Button>
          </Popover>
        </>
      )}
      <VoteModal stepMsg$={stepMsg$} msgData={msgData} />
    </>
  );
};

export default DiscussTitle;
