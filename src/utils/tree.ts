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
  if(tree[0]){
    keys.push(tree[0].id)
  }
  return keys;
}

export function getTowLevelKeys(tree) {
  const keys: string[] = [];
  tree.forEach((v) => {
    keys.push(v.id);
    v?.children?.forEach((vc) => {
      keys.push(vc.id);
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