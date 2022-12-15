import { createStore } from 'ice';

interface User {
  userId?: string;
  userName?: string;
  token?: string;
  isFirstLogin?: boolean;
}
const store = createStore({
  user: {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    state: {} as User,
    reducers: {
      update(prevState, payload) {
        return {
          ...prevState,
          ...payload,
        };
      },
      cover(prevState, payload) {
        return payload;
      },
    },
  },
});

export default store;
