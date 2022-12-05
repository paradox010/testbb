import { Steps } from 'antd';

import styles from './index.module.less';
import Panel from './Layout/Panel';
import DefaultTool from './Layout/DefaultTool';
import Sign from './steps/Sign';
import Intro from './steps/Intro';
import RIntro from './steps/RIntro';
import Discuss from './steps/discuss';
import Vote from './steps/Vote';
import Checkin from './steps/Checkin';
import Release from './steps/Release';
import PageHeader from './PageHeader';

import { StepProps } from './msg.d';

import { stepState } from './basicContext';
import { useSnapshot } from 'valtio';

const stepItems = [
  { title: '到场签到', component: Checkin },
  { title: '开场介绍', component: Intro },
  { title: '提议介绍', component: RIntro },
  { title: '提议讨论', component: Discuss },
  { title: '评审投票', component: Vote },
  { title: '电子签字', component: Sign },
  { title: '定时发布', component: Release },
];

const Process: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { processState } = useSnapshot(stepState);
  if (processState === 0) {
    return <span>loading</span>;
  }
  const ChildComp = stepItems[processState - 1].component;
  return (
    <>
      <div className={styles.stepHeader}>
        <PageHeader stepMsg$={stepMsg$} />
        <Steps type="navigation" current={processState - 1} items={stepItems.map((v) => ({ title: v.title }))} />
      </div>
      <div className={styles.stepContent}>
        <Panel>
          <div className={styles.reviewStepHeader}>
            <ChildComp.Title stepMsg$={stepMsg$} msgData={msgData} />
          </div>
          <ChildComp stepMsg$={stepMsg$} msgData={msgData} />
          <div>
            {ChildComp?.Tool ? <ChildComp.Tool stepMsg$={stepMsg$} msgData={msgData} /> : null}
            <DefaultTool stepMsg$={stepMsg$} msgData={msgData} />
          </div>
        </Panel>
      </div>
    </>
  );
};

export default Process;
