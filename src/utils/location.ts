import { parse, stringify } from 'qs';

export function getParams(location = window.location) {
  if (location.search.split('?').length > 1) {
    const searchParams = parse(location.search.split('?')[1]);
    return searchParams;
  }
  return {};
}

export function appendSearch(location = window.location, newParams: Object) {
  const search = location?.search || '';
  let ss = '';
  if (search.split('?').length > 1) {
    let obj = parse(search.split('?')[1]);
    obj = { ...obj, ...newParams };
    ss = `?${stringify(obj)}`;
  } else {
    ss = `?${stringify(newParams)}`;
  }
  return ss;
}
