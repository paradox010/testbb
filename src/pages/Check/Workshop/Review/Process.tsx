import { Steps } from 'antd';

import styles from './index.module.less';
import Panel from './Panel';
import DefaultTool from './DefaultTool';
import Sign from './steps/Sign';
import Intro from './steps/Intro';
import RIntro from './steps/RIntro';
import Discuss from './steps/discuss';
import Vote from './steps/Vote';

const stepItems = [
  { title: '到场签到', component: Sign },
  { title: '开场介绍', component: Intro },
  { title: '提议介绍', component: RIntro },
  { title: '提议讨论', component: Discuss },
  { title: '评审投票', component: Vote },
  { title: '电子签字', component: Sign },
  { title: '定时发布', component: Sign },
];

export default ({ stepMsg$, msgData }) => {
  const ChildComp = stepItems[4].component;
  return (
    <>
      <div className={styles.stepHeader}>
        <div className={styles.upHeader}>
          流程<span>[ 身份：主持人 ]</span>
        </div>
        <Steps type="navigation" current={4} items={stepItems.map((v) => ({ title: v.title }))} />
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
