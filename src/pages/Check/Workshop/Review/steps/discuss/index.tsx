import styles from './index.module.less';

import DiscussTitle from './DiscussTitle';
import Domains from './Domains';

import { StepProps, StepCompType } from '../../msg.d';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  return <div className={styles.content}>discuss</div>;
};

const TypedStep = Step as StepCompType;

TypedStep.Title = DiscussTitle;
TypedStep.Tool = Domains;
export default TypedStep;
