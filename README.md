# JS-Counter

## Overview

Our counter example is a decentralized app that stores a number and exposes methods to `increment`, `decrement`, and `reset` it. It also features a friendly frontend with a smiling handheld console.

## Installation & Setup

To clone run:

```bash
git clone https://github.com/near-examples/js-counter.git
```

enter the folder with:

```bash
cd js-counter/
```

To download dependencies run:

```bash
yarn
```

or

```bash
npm i
```

## Building Your Smart Contract

The Smart Contract consists of four methods available for the user to call.

```javascript
    @call
    /// Public method: Increment the counter.
    increment() {
        this.val += 1;
        near.log(`Increased number to ${this.val}`)
    }

    @call
    /// Public method: Decrement the counter.
    decrement() {
        this.val -= 1;
        near.log(`Decreased number to ${this.val}`)
    }

    @call
    /// Public method - Reset to zero.
    reset() {
        this.val = 0;
        near.log(`Reset counter to zero`)
    }

    @view
    /// Public method: Returns the counter value.
    getNum(): number {
        return this.val
    }

```

A `call` method stores or modifies information that exists in state on the NEAR blockchain. Call methods do incur a gas fee. `Call` methods return no values

A `view` method retrieves information stored on the blockchain. No fee is charged for a view method. View methods always return a value.

`NearBindgen` is a decorator that exposes the state and methods to the user.

To build your smart contract run

```bash
yarn build-js

```

or

```bash
npm run build-js
```

This build script will build your smart contract and compile it down to a `.wasm` file, in this case named `contract-js.wasm`.

Once you have built out your smart contract you can deploy it to a NEAR account using:

```bash
near dev-deploy build/contract.wasm
```

`dev-deploy` will create a new dev account on NEAR's testnet, and deploy the selected `.wasm` file onto it.

The output should display the dev account name as follows.

example:

```
dev-1659920584637-66821958258766
```

Once a smart contract has been deployed it must be initialized.

Initialize This contract by running the following

```bash
near call <dev-account> init --accountId 'blockhead.testnet'
```

## Calling methods from terminal

From the init method the starting number was set to `0`.

This method will increment the value by 1

```bash
 near call <dev-account> increment '{}' --accountId <your-account.testnet>
```

This will return and display the value of the current number

```bash
near view <dev account> get_num '{}' --accountId <your-account.testnet>

```

Run the following to decrease the value of the current number.

```bash
 near call dev-1659920584637-66821958258766 decrement '{}' --accountId <your-account.testnet>
```

## Run Tests

This example repo comes with integration tests written in rust and assembly type script.

To run tests run the following in your terminal:

```bash
yarn test
```

or

```bash
npm run test
```

Integration tests are generally written in javascript. They automatically deploy your contract and execute methods on it. In this way, integration tests simulate interactions from users in a realistic scenario. You will find the integration tests for hello-near in integration-tests/.
