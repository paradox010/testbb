import Tree from '@/pages/Struct/Construct/Tree';
import { StepProps } from '../../msg.d';
import YModal from '@/pages/Struct/Construct/Modal';

const WrapTree: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  return (
    <>
      <Tree treeMsg$={stepMsg$} yTree={msgData.yTree} type="review" />
      <YModal treeMsg$={stepMsg$} yTree={msgData.yTree} />
    </>
  );
};

export default WrapTree;
