import { VoteBasicType, SocketVoteItem, UserVoteRes } from '../msg';

// isFinished的时候需要传递所有的投票结果，以这次投票结果为准；

export interface VoteItem {
  id: string;
  content?: string;
  isFinished?: boolean;
  voteResult: UserVoteRes[];
  createTime: number;
  isVote?: boolean;
}
class Vote {
  voteList: VoteItem[];

  constructor(vote?: VoteBasicType) {
    this.init(vote);
  }

  init(vote?: VoteBasicType) {
    this.voteList = [];
    vote && this.pushReview(vote);
  }

  pushReview(vote: VoteBasicType, userVote?: UserVoteRes) {
    const idx = this.voteList.findIndex((v) => v.id === vote.id);
    const nV = userVote ? [userVote] : [];
    if (userVote) {
      // eslint-disable-next-line no-param-reassign
      (vote as VoteItem).isVote = true;
    }
    if (idx !== -1) {
      if (vote.voteResult) {
        this.voteList[idx] = vote as VoteItem;
      } else {
        this.voteList[idx] = {
          ...vote,
          voteResult: nV,
        };
      }
    } else {
      this.voteList.push({ ...vote, voteResult: vote.voteResult || nV });
    }
  }

  pushOpe(vote: SocketVoteItem) {
    const item = this.voteList.find((v) => v.id === vote.id);
    if (vote.type === 3) {
      // 投票信息
      const { type, ...newVote } = vote;
      if (item) {
        if (item.isFinished) {
          return; // 通过后不做任何处理
        }
        const idx = item.voteResult.findIndex((v) => v.userId === vote.userId);
        if (idx !== -1) {
          item.voteResult[idx] = { ...item.voteResult[idx], ...newVote };
        } else {
          item.voteResult.push(newVote);
        }
        item.isVote = true;
      } else {
        this.voteList.push({
          id: newVote.id,
          voteResult: [
            {
              userId: newVote.userId,
              isAgree: newVote.isAgree,
            },
          ],
          createTime: newVote.createTime,
        });
      }
    } else {
      const { type, ...newVote } = vote;
      if (item) {
        // update vote basic config
        // eslint-disable-next-line guard-for-in
        for (const k in newVote) {
          item[k] = newVote[k];
        }
        if (type === 2) {
          // 投票截止
          item.isFinished = true;
        }
      } else {
        this.voteList.push({
          ...newVote,
          voteResult: [],
        });
      }
    }
  }

  // 获取最近一次的投票信息, 顺便删除其他的投票 只能返回副本
  getLatest() {
    if (this.voteList.length < 1) {
      return;
    }
    let latest = this.voteList[0];
    this.voteList.forEach((v) => {
      if (v.createTime > latest.createTime) {
        latest = v;
      }
    });
    this.voteList = [latest];
    return { ...latest };
  }
}

export default Vote;
