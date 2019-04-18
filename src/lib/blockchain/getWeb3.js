import Web3 from 'web3';
import Fortmatic from '../../configs/fortmatic';
import config from '../../configuration';

const provider = 'Fortmatic';
let newWeb3;
let enablePromise;

function enable(force = false) {
  if (!force && enablePromise) return enablePromise;

  enablePromise = new Promise((resolve, reject) =>
    this.currentProvider
      .enable()
      .then(addrs => {
        this.isEnabled = true;
        resolve(addrs);
      })
      .catch(e => {
        enablePromise = false;
        this.isEnabled = false;
        reject(e);
      }),
  );

  return enablePromise;
}

export default () =>
  new Promise(resolve => {
    if (document.readyState !== 'complete') {
      // wait until complete
    }
    if (!newWeb3) {
      if (provider === 'Metamask') {
        if (window.ethereum) {
          newWeb3 = new Web3(window.ethereum);
          newWeb3.enable = enable.bind(newWeb3);
        } else {
          // we provide a fallback so we can generate/read data
          newWeb3 = new Web3(config.foreignNodeConnection);
          newWeb3.defaultNode = true;
        }
      } else if (provider === 'Fortmatic') {
        if (Fortmatic) {
          newWeb3 = new Web3(Fortmatic.getProvider());
          newWeb3.enable = enable.bind(newWeb3);
        } else {
          // we provide a fallback so we can generate/read data
          newWeb3 = new Web3(config.foreignNodeConnection);
          newWeb3.defaultNode = true;
        }
      }
    }

    resolve(newWeb3);
  });
