const contractPerNetwork = {
  mainnet: 'hello.near-examples.near',
  testnet: 'counter.near-examples.testnet',
};

export const NetworkId = 'testnet';
export const CounterContract = contractPerNetwork[NetworkId];
