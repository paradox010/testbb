// 是否需要记录自己的一些信息？
interface User {
  userName: string;
  userId: string;
  isOnline?: boolean;
  isCheck?: boolean; // 快捷签到
  company?: string;
}
interface Vote {
  title: string; // 投票的内容
  id: string; // 投票id
}

// 可以用来定位演讲人的position
interface Pos {
  treeId?: string;
  treeLocation?: string;
  ifInAttr?: boolean;
  attrLocation?: string;
}
// 到场签到
interface Step1 {
  step: 1;
}

// request baseConfig of the version
interface Step2 {
  step: 2;
}

interface Step3 {
  step: 3;
  content: {
    user: User;
    startTime: number;
    pos: Pos;
  };
}

// 本步骤中的操作记录在localStorage中，方便断开重连后定位自己的上一次操作
interface Step4 {
  step: 4;
  pos: Pos;
  filePos?: Pos;
  vote?: Vote;
}

interface Step5 {
  step: 5;
  voteContent: {};
}

interface Step6 {
  step: 6;
  signContent: {};
}

interface Step7 {
  step: 7;
  releaseContent: {};
}

type Step = Step1 | Step2 | Step3 | Step4 | Step5 | Step6 | Step7;

interface MeetSocketInit {
  mesType: 'init';
  role: 'auto' | 'user' | 'checker';
  step: Step; // 签到/介绍/提议介绍/提议讨论/投票/签字/发布
  meetRecord: []; // 会议直播记录
  userList: User[];
}

// 接受到的信息
interface MeetSocketLog {
  mesType: 'meetLog';
  content: {}; // meetLog has many type!!
}

interface MeetSocketOpe {
  mesType: 'operation';
}

interface MeetSocketUser {
  mesType: 'user';
}

// 需要后台记录的信息
// interface MeetSocketRecord {

// }

export type MeetSocketMsgType = MeetSocketInit;

// 发送消息的格式
// user: 上线，签到 record
interface SendUser {
  msgType: 'user';
  step: number;
  user: User;
}

// 投票类
interface SendVote {
  msgType: 'vote';
  voteType: 'create' | 'vote_is' | 'vote_no' | 'recommend' | 'force';
  user: User;
  vote: Vote;
}

// 控制流程 & 定位的信息记录/发送 & 投票的发起/发送 msgType: 'step'
type SendStep = Step1 | Step2 | Step3 | Step4 | Step5 | Step6 | Step7;

// 操作类
interface SendOpe {
  msgType: 'operation';
  user: User;
}

interface SendBro {
  msgType: 'self_broadcast';
}

type SendMsgType = SendUser | SendVote | SendStep | SendBro;

// 组件内通信

interface dontkown {
  msgType: 'process';
  step: number;
}
type CompMsgType = dontkown;
