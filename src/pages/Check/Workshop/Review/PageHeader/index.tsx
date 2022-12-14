import { Button } from 'antd';
import { useContext } from 'react';
import BasicContext from '../basicContext';
import { reviewUserRoleTypeEnum } from '@/dataType';
import { StepProps } from '../msg.d';
import { LockFilled } from '@ant-design/icons';

const PageHeader: React.FC<Omit<StepProps, 'msgData'>> = ({ stepMsg$ }) => {
  const basic = useContext(BasicContext);

  const freeze = () => {
    stepMsg$.emit({
      type: 'freeze',
      content: {
        isFreeze: true,
      },
    });
  };

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 24px', fontSize: 16 }}>
      <span style={{ fontWeight: 'bold' }}>流程</span>{' '}
      <span> [ 身份：{reviewUserRoleTypeEnum.find((v) => v.value === basic.userRole)?.label} ]</span>
      {basic.userRole === '4' && (
        <Button icon={<LockFilled />} type="primary" style={{ float: 'right', marginTop: -5 }} onClick={freeze}>
          冻结会议
        </Button>
      )}
    </div>
  );
};
export default PageHeader;
