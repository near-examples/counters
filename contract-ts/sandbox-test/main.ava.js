import anyTest from 'ava';
import { Worker, NEAR } from 'near-workspaces';
import { setDefaultResultOrder } from 'dns'; setDefaultResultOrder('ipv4first'); // temp fix for node >v17

/**
 *  @typedef {import('near-workspaces').NearAccount} NearAccount
 *  @type {import('ava').TestFn<{worker: Worker, accounts: Record<string, NearAccount>}>}
 */
const test = anyTest;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = t.context.worker = await Worker.init();
  const root = worker.rootAccount;

  // some test accounts
  const alice = await root.createSubAccount("alice", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });
  const contract = await root.createSubAccount("contract", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.accounts = { contract, alice };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("can be incremented", async (t) => {
  const { alice, contract } = t.context.accounts;
  const startCounter = await contract.view("get_num", {});
  await alice.call(contract, "increment", {});
  const endCounter = await contract.view("get_num", {});
  t.is(endCounter, startCounter + 1);
});

test("can be decremented", async (t) => {
  const { alice, contract } = t.context.accounts;
  await alice.call(contract, "increment", {});
  const startCounter = await contract.view("get_num", {});
  await alice.call(contract, "decrement", {});
  const endCounter = await contract.view("get_num", {});
  t.is(endCounter, startCounter - 1);
});

test("can be reset", async (t) => {
  const { alice, contract } = t.context.accounts;
  await alice.call(contract, "increment", {});
  await alice.call(contract, "increment", {});
  await alice.call(contract, "reset", {});
  const endCounter = await contract.view("get_num", {});
  t.is(endCounter, 0);
});
