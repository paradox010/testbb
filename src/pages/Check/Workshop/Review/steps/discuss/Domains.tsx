import RND from '@/pages/Struct/Construct/RND';
import { FileTextOutlined } from '@ant-design/icons';
import { StepProps } from '../../msg.d';

const Domains: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  return (
    <>
      <RND
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>修订文件</div>
          </>
        }
        noPadding
        title={'修订文件'}
      >
        <div>111</div>
      </RND>
    </>
  );
};

export default Domains;
