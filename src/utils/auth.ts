import store from '../store';

const tokenName = 'token';

export function outLogin() {
  setToken('');
  // removeToken()
}

function removeToken() {
  if (process.env.NODE_ENV === 'development') {
    sessionStorage.removeItem(tokenName);
  } else {
    localStorage.removeItem(tokenName);
  }
}

export function useOutLogin() {
  const [_, disp] = store.useModel('user');
  return () => {
    outLogin();
    disp.cover({});
  };
}

export function setToken(newToken) {
  if (process.env.NODE_ENV === 'development') {
    sessionStorage.setItem(tokenName, newToken);
  } else {
    localStorage.setItem(tokenName, newToken);
  }
}

export function getToken() {
  let token;
  if (process.env.NODE_ENV === 'development') {
    token = sessionStorage.getItem(tokenName);
  } else {
    token = localStorage.getItem(tokenName);
  }
  return token;
}
