import { proxy } from 'valtio';

interface StateType {
  name: string;
  domainId: string;
  step: 'name' | 'choice' | 'import' | 'importView' | 'merge';
  fileName?: string;
  mergeCategoryKey?: string;
  mergeFeatureKey?: string;
  afterMerge?: {
    mergeCategoryKey: string;
    mergeFeatureKey: string;
  }
}
const initState: StateType = {
  name: '默认名称',
  step: 'name',
  fileName: 'car.xls',
  domainId: '',
  mergeCategoryKey: '',
  mergeFeatureKey: '',
  afterMerge: undefined,
};
const baseState = proxy<StateType>(initState);

export const init = () => {
  // eslint-disable-next-line guard-for-in
  for (const k in initState) {
    baseState[k] = initState[k];
  }
};
export default baseState;
