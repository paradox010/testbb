export function pushRecord(list, item) {
  if (!item) return;
  // 到序
  let ind = -1;
  const idx = list.findIndex((v) => v.id === item.id);
  if (idx !== -1) {
    list.splice(idx, 1, item);
    return;
  }
  for (let i = 0; i < list.length; i++) {
    if (item.receiveTime > list[i].receiveTime) {
      break;
    }
    ind = i;
  }
  list.splice(ind + 1, 0, item);
}
