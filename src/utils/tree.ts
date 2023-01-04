export function findNodeFromPath(path, tree) {
  if (!path) return;
  const paths = path.split('|');
  let item = tree;
  paths.forEach((k, i) => {
    item = item?.find((v) => v.id === k);
    if (i !== paths.length - 1) {
      item = item?.children;
    }
  });
  return item;
}

export function getTopKey(tree) {
  const keys: string[] = [];
  if (tree[0]) {
    keys.push(tree[0].id);
  }
  return keys;
}

export function getTowLevelKeys(tree) {
  const keys: string[] = [];
  tree.forEach((v) => {
    if (v.children?.length > 0) {
      keys.push(v.id);
    }
    v?.children?.forEach((vc) => {
      if (vc.children?.length > 0) {
        keys.push(vc.id);
      }
      // vc?.children?.forEach((vcc) => {
      //   keys.push(vcc.id);
      //   vcc?.children?.forEach((vccc) => {
      //     keys.push(vccc.id);
      //   });
      // });
    });
  });
  return keys;
}

function findNodeInTree(tree, id) {
  let qop: any[] = [];
  qop = [...tree];
  while (qop.length) {
    const i = qop.shift();
    if (i.id === id) {
      return i;
    }
    i?.children?.forEach((v) => {
      v.myPath = [...(i.myPath ? i.myPath : [i.id]), v.id];
    });
    if (i.children) {
      qop = [...qop, ...i.children];
    }
  }
}

function iterTree(tree: any[], callback?: (value: any) => void) {
  let qop: any[] = [];
  qop = [...tree];
  while (qop.length) {
    const i = qop.shift();
    callback && callback(i);
    if (i.children) {
      qop = [...qop, ...i.children];
    }
  }
}

export function getChildrenKeysWithNoLeaf(tree: any[]) {
  const res: any[] = [];
  iterTree(tree, (node) => {
    if (node.children && node.children.length) {
      res.push(node.id);
    }
  });
  return res;
}

export function getChildrenKeys(tree: any[]) {
  const res: any[] = [];
  iterTree(tree, (node) => {
    res.push(node.id);
  });
  return res;
}
