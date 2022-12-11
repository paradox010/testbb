import { LeftOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd/lib/tooltip';

const BackTitle: React.FC<{
  tooltip?: TooltipProps;
  back?: () => void;
  title?: string;
  style?: React.CSSProperties;
}> = ({ tooltip, back = () => {}, title = '详情', style = {} }) => {
  return (
    <div className="ds-back-title" style={style}>
      {tooltip ? (
        <Tooltip {...tooltip}>
          <LeftOutlined onClick={back} />
        </Tooltip>
      ) : (
        <LeftOutlined onClick={back} />
      )}
      <span>{title}</span>
    </div>
  );
};
export default BackTitle;
