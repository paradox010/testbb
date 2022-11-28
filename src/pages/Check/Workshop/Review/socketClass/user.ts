export interface UserItem {
  userId: string; // 时间戳
  userName: string;
  role: number;
  isOnline?: boolean;
  checkIn?: boolean;
}

export default class UserList {
  list: UserItem[];
  constructor(list: UserItem[] = []) {
    this.init(list);
  }
  init(list: UserItem[]) {
    this.list = list;
  }

  push(item: UserItem) {
    if (!item) return;
    const idx = this.list.findIndex((v) => v.userId === item.userId);
    if (idx !== -1) {
      this.list[idx] = { ...this.list[idx], ...item };
      return;
    }
    this.list.push(item);
  }

  getList() {
    return this.list;
  }
}
