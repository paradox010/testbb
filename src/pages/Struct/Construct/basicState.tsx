import { StepStateType } from './msg.d';
import { proxy } from 'valtio';


export const basicState = proxy<StepStateType>({
  specialOpes: [],
  isFreeze: false,
});
