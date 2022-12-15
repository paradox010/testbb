// 覆盖includes的ts声明
interface MyReadonlyArray<T> extends ReadonlyArray<T> {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: any, fromIndex?: number): searchElement is ReadonlyArray<T>[number];
}

// specialOpes
export const specialOpesTypes: MyReadonlyArray<'sync' | 'cover' | 'import'> = ['sync', 'cover', 'import'] as any;

// 评审状态
export const reviewStatuEnum = [
  {
    label: '待评审',
    value: 0,
    status: 'Warning',
  },
  {
    label: '正在进行',
    value: 1,
    status: 'Processing',
  },
  { 
    label: '已通过',
    value: 2,
    status: 'Success',
  },
  {
    label: '未通过',
    value: 3,
    status: 'Error'
  },
];
// 域的类型
export const domainTypeEnum = [
  {
    label: '通用域',
    value: 1,
    color: 'success',
  },
  {
    label: '私有域',
    value: 2,
    color: 'processing',
  },
];

// 评审的用户类型
export const reviewUserRoleTypeEnum = [
  {
    label: '主持人',
    value: '1',
  },
  {
    label: '演讲人',
    value: '2',
  },
  {
    label: '评审人',
    value: '3',
  },
  {
    label: '听证人',
    value: '4',
  },
];

// 属性的枚举值
export const attrTypeEnum = [
  {
    label: '枚举',
    value: '1',
  },
  {
    label: '数值',
    value: '2',
  },
  {
    label: '范围',
    value: '3',
  },
  {
    label: '文本',
    value: '4',
  },
  {
    label: '布尔',
    value: '5',
  },
];

// 属性的分类
export const attrEnum = [
  {
    label: '产品基础信息',
    value: '1',
  },
  {
    label: '产品计划信息',
    value: '2',
  },
  {
    label: '产品采购信息',
    value: '3',
  },
  {
    label: '产品销售信息',
    value: '4',
  },
  {
    label: '产品物流信息',
    value: '5',
  },
  {
    label: '产品服务信息',
    value: '6',
  },
  {
    label: '产品设计信息',
    value: '7',
  },
];

export const RoleType = [
  {
    label: '主持人',
    value: '1',
  },
  {
    label: '演讲人',
    value: '2',
  },
  {
    label: '评审人',
    value: '3',
  },
  {
    label: '听证人',
    value: '4',
  },
];
