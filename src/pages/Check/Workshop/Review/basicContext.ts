import React, { useState } from 'react';
import { User, StepStateType } from './msg.d';
import { proxy } from 'valtio';

import { subscribeKey } from 'valtio/utils';

const initState: StepStateType = {
  member: [],
  record: [],
  processState: 0,
  // proposalDomainId: undefined,
  isFreeze: false,
  version: '',
  isVote: false,
  // reviewVote:
  specialOpes: [],
  sign: '',
};
export const stepState = proxy<StepStateType>(initState);

export function init() {
  // eslint-disable-next-line guard-for-in
  for (const k in initState) {
    stepState[k] = initState[k];
  }
}

export function useMember({ watch }: { watch?: (v: StepStateType['member']) => void } = {}) {
  const [member, setMember] = useState<StepStateType['member']>([]);
  subscribeKey(stepState, 'member', (v) => {
    setMember(v);
    watch && watch(v);
  });
  return member;
}

export interface BasicContextProps {
  id: string;
  name: string;
  domainId: string;
  domainName: string;
  member: User[];
  process: any[];
  domain: any[];
  regulation: any[];
  userRole: string;
  self: User;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const BasicContext = React.createContext<BasicContextProps>({} as BasicContextProps);

export default BasicContext;
