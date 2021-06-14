import {environment} from '../../environments/environment';

export function buildUrl(endpoint, id?: string) {
  return environment.gms_api_server + '/' + environment.api_version + '/' + endpoint;
}

export function buildInventoryUrl(endpoint, id?: string) {
  return environment.gms_api_inventory + '/' + environment.api_version + '/' + endpoint;
}


export function convertDataToServer(object) {
  return Object.getOwnPropertyNames(object).reduce((a, b) => {
    if (typeof object[b] !== 'undefined') {
      if (typeof object[b] === 'object') {
        if (Array.isArray(object[b])) {
          a[b] = object[b].map(bItem => {
            if (typeof bItem === 'object') {
              return convertDataToServer(bItem);
            } else {
              return bItem;
            }
          });
        } else {
          if (object[b] && object[b].id) {
            a[b] = object[b].id;
          } else {
            a[b] = object[b];
          }
        }
      } else {
        if (b !== 'date_created' && b !== 'last_updated' && b !== 'created_by' && b !== 'modified_by') {
          a[b] = object[b];
        }
      }
    }
    return a;
  }, {});
}

export function formatNumber(value: number) {
  if (isNaN(value)) {
    return '0';
  } else {
    const n = Number(value);
    if (n === value && value % 1 === 0) { // isInteger
      return (value < 0 ? '-' : '') + Math.abs(Number(value)).toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(',');
    } else { // isFloat
      const p = value.toFixed(2).split('.');
      return p[0].split('').reverse().reduce((acc, num, i, orig) => {
        return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
      }, '') + '.' + p[1];
    }
  }
}


export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function caculatorDiscount(item: { discount: number, discount_type: 'FIXED' | 'PERCENTAGE' }, price: number, quantity = 1): number {
  let value = 0;
  if (price === 0 || quantity === 0) {
    return 0;
  }
  if (item.discount && item.discount_type) {
    if (item.discount_type === 'FIXED') {
      value = item.discount * quantity;
    } else {
      value = item.discount * price * quantity / 100;
    }
  }

  if (value < 0) {
    return 0;
  }
  if (value > price * quantity) {
    return price * quantity;
  }
  return value;
}
