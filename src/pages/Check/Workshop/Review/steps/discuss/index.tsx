import styles from './index.module.less';

import DiscussTitle from './DiscussTitle';
import DiscussTool from './DiscussTool';
import Tree from './Tree';
import AttrRoute from '../../Layout/AttrRoute';
import EditMsg from '../Attr/EditMsg';

import { StepProps, StepCompType } from '../../msg.d';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  return (
    <AttrRoute stepMsg$={stepMsg$} style={{ height: '100%' }} type="edit">
      <div className={styles.content}>
        <Tree stepMsg$={stepMsg$} msgData={msgData} />
      </div>
      {/* attrRoute内部处理id&back msgData 非常丑陋的实现方式 */}
      <EditMsg id back upData={msgData} />
    </AttrRoute>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = DiscussTitle;
TypedStep.Tool = DiscussTool;
export default TypedStep;
