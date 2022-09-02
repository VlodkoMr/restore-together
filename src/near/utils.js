import Big from "big.js";
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'
import { NFTStorage, File } from '../assets/bundle.esm.min'
// import { NFTStorage, File } from 'nft.storage'

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
      'get_performer_facilities',
      'get_execution_progress',
      'get_available_tokens_amount',
      'is_investor_nft_minted'
    ],
    changeMethods: [
      'add_facility',
      'add_investment',
      'add_facility_proposal',
      'create_performer_account',
      'vote_for_performer',
      'add_execution_progress',
      'performer_claim_tokens',
      'performer_set_completed',
      'mint_investor_nft'
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

export const resizeFileImage = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;

      setTimeout(() => {
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      }, 300);
    };
    reader.readAsDataURL(file);
  });
}

export const uploadMediaToIPFS = (media) => {
  return new Promise(async (resolve, reject) => {
    const name = `${+new Date()}.jpg`;
    const image = dataURLtoFile(media, name);
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
    const token = await nftStorage.store({
      image,
      name,
      description: "Restore Together",
    });

    if (token.url) {
      resolve(token.data.image.pathname.replace('//', ''));
    }
    reject();
  })
}

export const transformFacility = (item) => {
  item.lat = parseFloat(item.lat);
  item.lng = parseFloat(item.lng);
  return item;
}
