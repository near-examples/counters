# Count on NEAR Contract

The smart contract exposes methods to interact with a counter stored in the NEAR network.

```ts
val: number = 0;

@view
// Public read-only method: Returns the counter value.
get_num(): number {
  return this.val
}

@call
// Public method: Increment the counter.
increment() {
  this.val += 1;
  near.log(`Increased number to ${this.val}`)
}

@call
// Public method: Decrement the counter.
decrement() {
  this.val -= 1;
  near.log(`Decreased number to ${this.val}`)
}

@call
// Public method - Reset to zero.
reset() {
  this.val = 0;
  near.log(`Reset counter to zero`)
}
```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
npm run deploy
```

Once finished, check the `~/.near-credentials/testnet` directory to find the address in which the contract was deployed:

```bash
cat ~/.near-credentials/testnet/counter-62af7c90-3.testnet.json
# e.g. {"account_id":"counter-62af7c90-3.testnet","public_key":"ed25519:59wcVk2q2tkibZLH6SRAFuPf2RRvNPDRTzdgnRSqHV7b","private_key":"ed25519:*****"}
```

<br />

## 2. Get the Counter

`get_num` is a read-only method (aka `view` method).

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the counter value
near view <dev-account> get_num
```

<br />

## 3. Modify the Counter
`increment`, `decrement` and `reset` change the contract's state, for which they are `call` methods.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Use near-cli to set increment the counter
near call <dev-account> increment --accountId <dev-account>
```

**Tip:** If you would like to call `increment` using your own account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <your-account>`.