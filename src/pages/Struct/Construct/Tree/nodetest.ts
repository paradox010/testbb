// 新增子节点，新增子节点的子节点，
// ytree.operation.add({
//   id: 12,
//   newNodes: [{ title: '0-0-0-0-8-key', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });
// ytree.operation.add({
//   id: 14,
//   newNodes: [{ title: '0-0-0-0-0-8-key', key: '0-0-0-0-0-8-key', id: '0-0-0-0-0-8-key', pId: '0-0-0-0-8-key' }],
//   opeType: 'add',
// });

// 新增子节点 乱序
// ytree.operation.add({
//   id: 14,
//   newNodes: [{ title: '0-0-0-0-0-8-key', key: '0-0-0-0-0-8-key', id: '0-0-0-0-0-8-key', pId: '0-0-0-0-8-key' }],
//   opeType: 'add',
// });
// ytree.operation.add({
//   id: 13,
//   newNodes: [{ title: '0-0-0-0-9-key', key: '0-0-0-0-9-key', id: '0-0-0-0-9-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });
// ytree.operation.add({
//   id: 12,
//   newNodes: [{ title: '0-0-0-0-8-key', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });

// 先更新，后新增 => update node
// ytree.operation.add({
//   id: 14,
//   newNodes: [{ title: 'update', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key' }],
//   opeType: 'update',
// });
// ytree.operation.add({
//   id: 13,
//   newNodes: [{ title: '0-0-0-0-8-key', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });
// 更新乱序
// ytree.operation.add({
//   id: 10,
//   newNodes: [{ title: 'update1', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key' }],
//   opeType: 'update',
// });
// ytree.operation.add({
//   id: 14,
//   newNodes: [{ title: 'update3', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key' }],
//   opeType: 'update',
// });
// // 截断以下
// ytree.operation.add({
//   id: 13,
//   newNodes: [{ title: 'update2', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key' }],
//   opeType: 'update',
// });
// ytree.operation.add({
//   id: 10,
//   newNodes: [{ title: '0-0-0-0-8-key', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });

// 删除节点 先删除后新增
// ytree.operation.add({
//   id: 20,
//   newNodes: [{ key: '0-0-0-0-8-key', id: '0-0-0-0-8-key' }],
//   opeType: 'delete',
// });

// ytree.operation.add({
//   id: 19,
//   newNodes: [{ title: '0-0-0-0-8-key', key: '0-0-0-0-8-key', id: '0-0-0-0-8-key', pId: '0-0-0-0-key' }],
//   opeType: 'add',
// });

// 删除顶层节点
// ytree.operation.add({
//   id: 30,
//   newNodes: [{ key: '0-0-key', id: '0-0-key' }],
//   opeType: 'delete',
// });

// 删除是特殊的移动
// a->b a->c
// 当前如果冲突，则无效本次；如果outOrder，则需undo回这次的时间点，再顺序执行。
// ytree.operation.add({
//   id: 40,
//   newNodes: [{ id: '0-0-0-0-0-2-key', pId: '0-0-0-0-0-1-key' }],
//   opeType: 'move',
// });

// ytree.operation.add({
//   id: 30,
//   newNodes: [{ id: '0-0-0-0-0-2-key', pId: '0-0-0-0-0-0-2-key' }],
//   opeType: 'move',
// });

// a->delete ; a->b ; b->a ;
// ytree.operation.add({
//   id: 12,
//   newNodes: [{ id: '0-0-0-0-0-2-key' }],
//   opeType: 'delete',
// });
// ytree.operation.add({
//   id: 14,
//   newNodes: [{ id: '0-0-0-0-0-2-key', pId: '0-0-0-0-0-1-key' }],
//   opeType: 'move',
// });

// ytree.operation.add({
//   id: 13,
//   newNodes: [{ id: '0-0-0-0-0-1-key', pId: '0-0-0-0-0-2-key' }],
//   opeType: 'move',
// });


// const onDragOver = (info) => {
//   if (info.event.target) {
//       scrollTo(info.event.target);
//   }
// };

// const scrollTo = useCallback(
//   throttle((target) => {
//       const { bottom: currentBottom, top: currentTop } = target.getBoundingClientRect();
//       const { bottom: boxBottom, top: boxTop } = document
//           .getElementsByClassName('ant-tree-list-holder')[0]
//           .getBoundingClientRect();

//       if (currentTop > boxBottom - 48) {
//           document.getElementsByClassName('ant-tree-list-holder')[0].scrollTop =
//               document.getElementsByClassName('ant-tree-list-holder')[0].scrollTop + 32;
//       }

//       if (boxTop + 48 > currentBottom) {
//           document.getElementsByClassName('ant-tree-list-holder')[0].scrollTop =
//               document.getElementsByClassName('ant-tree-list-holder')[0].scrollTop - 32;
//       }
//   }, 100),
//   [treeRef]
// );
