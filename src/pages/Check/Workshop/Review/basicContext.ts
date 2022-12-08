import React, { useState } from 'react';
import { User, StepStateType } from './msg.d';
import { proxy } from 'valtio';

import { subscribeKey } from 'valtio/utils';

export const stepState = proxy<StepStateType>({
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
});

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
