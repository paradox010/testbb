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
