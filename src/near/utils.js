import Big from "big.js";
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  window.near = await connect(Object.assign({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore()
    }
  }, nearConfig))

  window.walletConnection = new WalletConnection(window.near, null)
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: [
      'get_region_facility',
      'get_facility_by_id',
      'get_facilities_by_id',
      'get_facility_investment',
      'get_user_info',
      'get_investor_facilities',
      'get_facility_proposals',
      'get_all_performers',
      'get_performer_facilities'
    ],
    changeMethods: [
      'add_facility',
      'add_investment',
      'add_facility_proposal',
      'create_performer_account',
      'vote_for_performer'
    ],
  });
}

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, {
    type: mime,
    lastModified: new Date().getTime()
  });
}

export function getMediaUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`;
}

export const convertFromYocto = (amount, digits = 1) => {
  return Big(amount)
    .div(10 ** 24)
    .toFixed(digits);
};

export const convertFromNanoSeconds = (timestamp) => {
  return parseInt(Big(timestamp).div(1000000).toFixed());
};


export const timestampToDate = (timestamp) => {
  const timeSeconds = convertFromNanoSeconds(timestamp);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(timeSeconds).toLocaleDateString("en-US", options);
};

export const convertToYocto = (amount) => {
  return Big(amount)
    .times(10 ** 24)
    .toFixed();
};
export const convertToTera = (amount) => {
  return Big(amount)
    .times(10 ** 12)
    .toFixed();
};
