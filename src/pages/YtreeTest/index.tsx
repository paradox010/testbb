import { useEffect } from "react";
import { YTree } from "../Struct/Construct/Tree/node";

const originTree = JSON.stringify([
  {
    id: '0',
    name: 'root0',
    children: [
      {
        id: '0-0',
        name: 'child0',
      },
      {
        id: '0-1',
        name: 'child1',
      },
    ],
  },
  {
    id: '1',
    name: 'root1',
  },
]);
const trashTree = [];

function initTree() {
  return new YTree(JSON.parse(originTree), []);
}

export default () => {
  useEffect(()=>{
    window.ytree = initTree();
  },[])
  return <div>1122312</div>;
};
