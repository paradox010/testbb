import React, { useState } from 'react';
import { User, StepStateType } from './msg.d';
import { proxy } from 'valtio';

import { subscribeKey } from 'valtio/utils';

const initState: StepStateType = {
  member: [],
  record: [],
  objection: [],
  processState: 0,
  // proposalDomainId: undefined,
  isFreeze: false,
  // version: '',
  // selectVersion: '',
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

interface DomainType {
  domainName: string;
  domainPubId: string;
  userName: string;
  categoryCount: number;
  featureCount: number;
  version: string;
}

export interface BasicContextProps {
  id: string;
  name: string;
  domainId: string;
  domainName: string;
  // member: User[]; // 初始化member由于后续有剔除的逻辑，member都由socket当中的member维护
  process: any[];
  domain: DomainType[];
  domainPreferred: DomainType[];
  domainCount: number;
  domainPreferredCount: number;
  regulation: any[];
  userRole: string;
  self: User;
  startTime: number;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const BasicContext = React.createContext<BasicContextProps>({} as BasicContextProps);

export default BasicContext;
