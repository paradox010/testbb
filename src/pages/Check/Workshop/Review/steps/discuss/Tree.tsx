import Tree from '@/pages/Struct/Construct/Tree';
import { StepProps } from '../../msg.d';
import YModal from '@/pages/Struct/Construct/Modal';
import { useContext } from 'react';
import BasicContext from '../../basicContext';

const WrapTree: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const basic = useContext(BasicContext);
  return (
    <>
      <Tree treeMsg$={stepMsg$} yTree={msgData.yTree} type="review" editable={msgData.self.userRole==='1'} domainId={basic.domainId} />
      <YModal treeMsg$={stepMsg$} yTree={msgData.yTree} />
    </>
  );
};

export default WrapTree;
