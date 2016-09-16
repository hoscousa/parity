import registryAbi from '../abi/registry.json';
import tokenregAbi from '../abi/tokenreg.json';

const { api } = window.parity;

export const SET_LOADING = 'SET_LOADING';
export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  isLoading
});

export const FIND_CONTRACT = 'FIND_CONTRACT';
export const loadContract = () => (dispatch) => {
  dispatch(setLoading(true));

  api.ethcore
    .registryAddress()
    .then((registryAddress) => {
      console.log(`registry found at ${registryAddress}`);
      const registry = api.newContract(registryAbi, registryAddress).instance;

      return registry.getAddress.call({}, [api.format.sha3('tokenreg'), 'A']);
    })
    .then((address) => {
      address = '0x40cFb0cd89d0D281889eE7920a1929ab1d0A96cF';

      console.log(`tokenreg was found at ${address}`);
      const contract = api.newContract(tokenregAbi, address);

      const { instance } = contract;

      dispatch(setContractDetails({ address, instance, raw: contract }));
      dispatch(loadContractDetails());

      contract.subscribe(null, {
        fromBlock: 0,
        toBlock: 'pending'
      }, (error, logs) => {
        if (error) {
          console.error('setupFilters', error);
          return;
        }

        if (logs.length === 0) return;

        console.log('logs', logs);
      });
    })
    .catch((error) => {
      console.error('loadContract error', error);
    });
};

export const LOAD_CONTRACT_DETAILS = 'LOAD_CONTRACT_DETAILS';
export const loadContractDetails = () => (dispatch, getState) => {
  let state = getState();

  let instance = state.status.contract.instance;

  Promise
    .all([
      instance.owner.call(),
      instance.fee.call()
    ])
    .then(([owner, fee]) => {
      console.log(`owner as ${owner}, fee set at ${fee.toFormat()}`);

      dispatch(setContractDetails({
        fee,
        owner
      }));

      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.error('loadContractDetails error', error);
    });
};

export const SET_CONTRACT_DETAILS = 'SET_CONTRACT_DETAILS';
export const setContractDetails = (details) => ({
  type: SET_CONTRACT_DETAILS,
  details
});
