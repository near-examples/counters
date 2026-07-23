import anyTest from 'ava';
import { readFileSync } from 'fs';
import { Sandbox, DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY } from 'near-sandbox';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, nearToYocto } from 'near-api-js';

/**
 *  @type {import('ava').TestFn<{sandbox: import('near-sandbox').Sandbox, provider: JsonRpcProvider, alice: Account, contract: Account}>}
 */
const test = anyTest;

test.beforeEach(async (t) => {
  // Start a fresh sandbox for each test (NEAR_SANDBOX_VERSION overrides the binary, e.g. on older glibc)
  const sandbox = await Sandbox.start({ version: process.env.NEAR_SANDBOX_VERSION });
  const provider = new JsonRpcProvider({ url: sandbox.rpcUrl });

  // All accounts share the sandbox genesis key for simplicity
  const keyPair = KeyPair.fromString(DEFAULT_PRIVATE_KEY);
  const signer = new KeyPairSigner(keyPair);

  const root = new Account(DEFAULT_ACCOUNT_ID, provider, signer);

  for (const prefix of ['alice', 'contract']) {
    await root.createSubAccount({
      accountOrPrefix: prefix,
      publicKey: keyPair.getPublicKey(),
      nearToTransfer: nearToYocto('30'),
    });
  }

  const alice = new Account(`alice.${DEFAULT_ACCOUNT_ID}`, provider, signer);
  const contract = new Account(`contract.${DEFAULT_ACCOUNT_ID}`, provider, signer);

  // Deploy the wasm file passed by the package.json test script
  await contract.deployContract(readFileSync(process.argv[2]));

  // Save state for test runs, it is unique for each test
  t.context = { sandbox, provider, alice, contract };
});

test.afterEach.always(async (t) => {
  // Stop the sandbox and clean up temporary files
  await t.context.sandbox.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

const getNum = (t) => t.context.provider.callFunction({
  contractId: t.context.contract.accountId,
  method: 'get_num',
  args: {},
});

const call = (t, methodName, args = {}) => t.context.alice.callFunction({
  contractId: t.context.contract.accountId,
  methodName,
  args,
});

test('can be incremented', async (t) => {
  const startCounter = await getNum(t);
  await call(t, 'increment');
  t.is(await getNum(t), startCounter + 1);
});

test('can be incremented 10 points', async (t) => {
  const startCounter = await getNum(t);
  await call(t, 'increment', { number: 10 });
  t.is(await getNum(t), startCounter + 10);
});

test('can be incremented -10 points', async (t) => {
  const startCounter = await getNum(t);
  await call(t, 'increment', { number: -10 });
  t.is(await getNum(t), startCounter - 10);
});

test('can be decremented', async (t) => {
  await call(t, 'increment');
  const startCounter = await getNum(t);
  await call(t, 'decrement');
  t.is(await getNum(t), startCounter - 1);
});

test('can be decremented 10 points', async (t) => {
  await call(t, 'increment');
  const startCounter = await getNum(t);
  await call(t, 'decrement', { number: 10 });
  t.is(await getNum(t), startCounter - 10);
});

test('can be decremented -10 points', async (t) => {
  await call(t, 'increment');
  const startCounter = await getNum(t);
  await call(t, 'decrement', { number: -10 });
  t.is(await getNum(t), startCounter + 10);
});

test('can be reset', async (t) => {
  await call(t, 'increment');
  await call(t, 'increment');
  await call(t, 'reset');
  t.is(await getNum(t), 0);
});
