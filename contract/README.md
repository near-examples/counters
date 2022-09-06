# Count on NEAR Contract

The smart contract exposes methods to interact with a counter stored in the NEAR network.

```rust
// Public read-only method: Returns the counter value.
pub fn get_num(&self) -> i8 {
  return self.val;
}

// Public method: Increment the counter.
pub fn increment(&mut self) {
  self.val += 1;
  log!("Increased number to {}", self.val);
}

// Public method: Decrement the counter.
pub fn decrement(&mut self) {
  self.val -= 1;
  log!("Decreased number to {}", self.val);
}

// Public method - Reset to zero.
pub fn reset(&mut self) {
  self.val = 0;
  log!("Reset counter to zero");
}
```

<br />

# Quickstart

1. Make sure you have installed [rust](https://rust.org/).
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
./deploy.sh
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
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