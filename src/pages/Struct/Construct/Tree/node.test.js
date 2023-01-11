/**
 * @jest-environment jsdom
 */
const { YTree } = require('./node');

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
const originTrashTree = [];

function initTree() {
  return new YTree(JSON.parse(originTree), []);
}

test('新增a', () => {
  const ytree = initTree();
  ytree.operation.add({
    id: 2,
    opeType: 'add',
    newNodes: [{ name: 'a', id: '0-0-0', parentId: '0-0' }],
  });
  ytree.operation.add({
    id: 3,
    opeType: 'add',
    newNodes: [{ name: 'b', id: '0-0-0-0', parentId: '0-0-0' }],
  });
  const pnode = ytree.getNode('0-0');
  expect(pnode.children[0]).toStrictEqual({
    parentId: '0-0',
    id: '0-0-0',
    name: 'a',
    children: [{ parentId: '0-0-0', id: '0-0-0-0', name: 'b' }],
  });
});

test('新增a->b,新增a, 乱序新增', () => {
  const ytree = initTree();
  ytree.operation.add({
    id: 3,
    opeType: 'add',
    newNodes: [{ name: 'b', id: '0-0-0-0', parentId: '0-0-0' }],
  });
  ytree.operation.add({
    id: 2,
    opeType: 'add',
    newNodes: [{ name: 'a', id: '0-0-0', parentId: '0-0' }],
  });
  const pnode = ytree.getNode('0-0');
  expect(pnode.children[0]).toStrictEqual({
    parentId: '0-0',
    id: '0-0-0',
    name: 'a',
    children: [{ parentId: '0-0-0', id: '0-0-0-0', name: 'b' }],
  });
});

test('先更新a,后新增a.name', () => {
  const ytree = initTree();
  ytree.operation.add({
    id: 3,
    opeType: 'update',
    newNodes: [{ name: 'newname', id: '0-0-0' }],
  });
  ytree.operation.add({
    id: 2,
    opeType: 'add',
    newNodes: [{ name: 'a', id: '0-0-0', parentId: '0-0' }],
  });
  const pnode = ytree.getNode('0-0');
  expect(pnode.children[0]).toStrictEqual({
    parentId: '0-0',
    id: '0-0-0',
    name: 'newname',
  });
});

describe('更新乱序,更新后fail', () => {
  const ytree = initTree();

  test('初始状态', () => {
    expect(ytree.getNode('0-0').name).toStrictEqual('child0');
  });

  test('更新操作3', () => {
    ytree.operation.add({
      id: 3,
      opeType: 'update',
      newNodes: [{ name: 'newname', id: '0-0' }],
    });
    expect(ytree.getNode('0-0').name).toStrictEqual('newname');
  });

  test('更新操作2', () => {
    ytree.operation.add({
      id: 2,
      opeType: 'update',
      newNodes: [{ name: 'oldname', id: '0-0' }],
    });
    expect(ytree.getNode('0-0').name).toStrictEqual('newname');
  });

  test('fail操作3', () => {
    ytree.operation.add({
      id: 3,
      opeType: 'update',
      isFail: true,
    });
    expect(ytree.getNode('0-0').name).toStrictEqual('oldname');
  });

  test('fail操作2', () => {
    ytree.operation.add({
      id: 2,
      opeType: 'update',
      isFail: true,
    });
    expect(ytree.getNode('0-0').name).toStrictEqual('child0');
  });
});

describe('删除节点', () => {
  test('先删除后新增', () => {
    const ytree = initTree();
    ytree.operation.add({
      id: 3,
      newNodes: [{ id: '0-0-0' }],
      opeType: 'delete',
    });
    ytree.operation.add({
      id: 2,
      newNodes: [{ id: '0-0-0', parentId: '0-0', name: 'a' }],
      opeType: 'add',
    });
    const trashTree = ytree.getOriginTrashTree();
    expect(trashTree).toStrictEqual([
      {
        id: '0-0-0',
        parentId: 'trash',
        name: 'a',
      },
    ]);
  });

  test('删除顶层节点', () => {
    const ytree = initTree();
    ytree.operation.add({
      id: 3,
      opeType: 'delete',
      newNodes: [{ id: '1' }],
    });
    const trashTree = ytree.getOriginTrashTree();
    expect(trashTree).toStrictEqual([
      {
        id: '1',
        parentId: 'trash',
        name: 'root1',
      },
    ]);
  });
});

// 当前如果冲突，则无效本次；则需undo回这次的时间点，再顺序执行。
describe('移动节点', () => {
  const ytree = initTree();
  ytree.operation.add({
    id: 3,
    newNodes: [{ id: '0-0', parentId: '0-1' }],
    opeType: 'move',
  });
  ytree.operation.add({
    id: 2,
    newNodes: [{ id: '0-1', parentId: '0-0' }],
    opeType: 'move',
  });
  // root.a,root.b, a->b b->a 以时间顺序为准
  test('冲突的操作无效化', () => {
    const pnode = ytree.getNode('0');
    expect(pnode.children).toStrictEqual([
      {
        id: '0-0',
        name: 'child0',
        parentId: '0',
        children: [
          {
            parentId: '0-0',
            id: '0-1',
            name: 'child1',
            children: [],
          },
        ],
      },
    ]);
  });

  // a->b isFail
  test('前一个移动操作失败', () => {
    ytree.operation.add({
      id: 2,
      isFail: true,
    });
    const pnode = ytree.getNode('0');
    expect(pnode.children).toStrictEqual([
      {
        id: '0-1',
        name: 'child1',
        parentId: '0',
        children: [
          {
            parentId: '0-1',
            id: '0-0',
            name: 'child0',
            children: [],
          },
        ],
      },
    ]);
  });
});

// a->b a->c
// ytree.operation.add({
//   id: 40,
//   newNodes: [{ id: '0-0-0-0-0-2-key', parentId: '0-0-0-0-0-1-key' }],
//   opeType: 'move',
// });

// ytree.operation.add({
//   id: 30,
//   newNodes: [{ id: '0-0-0-0-0-2-key', parentId: '0-0-0-0-0-0-2-key' }],
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
//   newNodes: [{ id: '0-0-0-0-0-2-key', parentId: '0-0-0-0-0-1-key' }],
//   opeType: 'move',
// });

// ytree.operation.add({
//   id: 13,
//   newNodes: [{ id: '0-0-0-0-0-1-key', parentId: '0-0-0-0-0-2-key' }],
//   opeType: 'move',
// });
