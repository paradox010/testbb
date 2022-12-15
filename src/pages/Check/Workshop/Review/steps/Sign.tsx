import { Button, Checkbox, Descriptions } from 'antd';
import { reviewUserRoleTypeEnum } from '@/dataType';
import Signature from '@/components/Signature/signature_pad';
import { useEffect, useRef, useContext } from 'react';

import { StepProps, StepCompType } from '../msg.d';

import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';

import styles from './sign.module.less';

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
  const submit = () => {
    stepMsg$.emit({
      type: 'sign',
      content: {
        sign: signRef.current?.toDataURL(),
      },
    });
  };
  const { member } = useSnapshot(stepState);
  const { self } = useContext(BasicContext);
  return (
    <div className={styles.signContent}>
      <Descriptions bordered column={1}>
        {reviewUserRoleTypeEnum.map((v) => (
          <Descriptions.Item
            key={v.value}
            label={v.label}
            labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}
          >
            {member
              ?.filter((u) => u.userRole === v.value)
              ?.map((u) => (
                <Checkbox disabled checked={!!u?.isSign} key={u.userId}>
                  <span style={{ color: '#000000d9' }}>{u.userName}</span>
                </Checkbox>
              ))}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <div style={{ padding: '15px 0 20px 0' }}>
        已确认流程规范，请签名
        <div style={{ float: 'right' }}>
          <Button onClick={clear}>清除</Button>
          <Button style={{ marginLeft: 10 }} onClick={submit} type="primary">
            提交
          </Button>
        </div>
      </div>
      <div className={styles.signWrapper}>
        <canvas ref={canvasRef} />
      </div>
      <div>上次提交的签名</div>
      <img width={200} src={member.find((v) => v.userId === self.userId)?.sign} />
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  const goNext = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 7,
      },
    });
  };
  const goBefore = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 5,
      },
    });
  };
  return (
    <>
      电子签名
      {msgData.self.userRole === '1' && (
        <Button type="primary" onClick={goNext}>
          版本发布
        </Button>
      )}
      {msgData.self.userRole === '1' && <Button onClick={goBefore}>上一步</Button>}
    </>
  );
};
export default TypedStep;
