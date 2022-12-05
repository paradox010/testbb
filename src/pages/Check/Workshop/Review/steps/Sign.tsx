import { Button, Checkbox, Descriptions } from 'antd';
import { RoleType } from '@/dataType';
import styles from './sign.module.less';
import Signature from '@/components/Signature/signature_pad';
import { useEffect, useRef } from 'react';

import { StepProps, StepCompType } from '../msg.d';

const pp = [
  {
    userId: '1',
    userName: 'a',
  },
  {
    userId: '2',
    userName: 'b',
  },
];

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const signRef = useRef<Signature>(null as any);
  const canvasRef = useRef<HTMLCanvasElement>(null as any);

  useEffect(() => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
    canvasRef?.current?.getContext('2d')?.scale(ratio, ratio);

    canvasRef.current.style.width = `${canvasRef.current.width}px`;

    // window.addEventListener('resize', resize);

    signRef.current = new Signature(canvasRef.current, {
      backgroundColor: 'rgb(0, 0, 0, 0)',
      minWidth: 1,
      maxWidth: 5,
    });
  }, []);

  const clear = () => {
    signRef.current?.clear();
  };

  return (
    <div className={styles.signContent}>
      <Descriptions bordered column={1}>
        {RoleType.map((v) => (
          <Descriptions.Item
            key={v.value}
            label={v.label}
            labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}
          >
            {pp.map((u) => (
              <Checkbox key={u.userId}>{u.userName}</Checkbox>
            ))}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <div>已确认流程规范，请签名</div>
      <Button onClick={clear}>清除</Button>
      <div className={styles.signWrapper}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      到场签到
      <Button type="primary">会议开始</Button>
    </>
  );
};
export default TypedStep;
