import { Button, DatePicker, Descriptions, Select } from 'antd';
import styles from './release.module.less';
import { Witness } from './Vote/VoteComp';

import { StepProps, StepCompType } from '../msg.d';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  return (
    <div className={styles.signContent}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="行业标准名称">行业产品主数据标准</Descriptions.Item>
        <Descriptions.Item label="发布标准版本号">
          <Select style={{ width: 200 }}>
            <Select.Option value="1.3">1.3</Select.Option>
            <Select.Option value="2.0">2.0</Select.Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="发布日期" span={2}>
          <DatePicker />
        </Descriptions.Item>
        <Descriptions.Item label="投票详情" span={2}>
          <Witness userType="3" modalType="modal" data={{}} noTitle />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  const goBefore = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 6,
      },
    });
  };
  return (
    <>
      定时发布
      <Button type="primary">
        确认
      </Button>
      <Button onClick={goBefore}>
        上一步
      </Button>
    </>
  );
};

export default TypedStep;
