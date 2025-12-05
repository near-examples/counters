# Count on NEAR Contract (Python)

The smart contract exposes methods to interact with a counter stored in the NEAR network.


# Quickstart

1. Make sure you have installed [Python](https://www.python.org/downloads/) >= 3.11
2. Install [uv](https://docs.astral.sh/uv/) for package management
3. Install the [NEAR CLI](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract

### Setup Virtual Environment

Creates a virtual environment with all required dependencies for building the contract.

```bash
uvx nearc contract.py --create-venv
```

### Build the Contract

Compile the contract to WebAssembly:

```bash
uvx nearc contract.py
```

This will create a `contract.wasm` file in the project root.

### Deploy to Testnet

```bash
near deploy <your-account-id>.testnet contract.wasm
```

### Initialize the Contract

After deployment, initialize the contract:

```bash
near call <your-account-id>.testnet initialize '{}' --accountId <your-account-id>.testnet
```

<br />

## 2. Get the Counter

`get_num` is a read-only method (aka `view` method).

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
near view <your-account-id>.testnet get_num
```

<br />

## 3. Modify the Counter

`increment`, `decrement` and `reset` change the contract's state, for which they are `call` methods.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Increment by 1 (default)
near call <your-account-id>.testnet increment '{}' --accountId <your-account-id>.testnet

# Increment by specific number
near call <your-account-id>.testnet increment '{"number": 5}' --accountId <your-account-id>.testnet

# Decrement by 1 (default)
near call <your-account-id>.testnet decrement '{}' --accountId <your-account-id>.testnet

# Decrement by specific number
near call <your-account-id>.testnet decrement '{"number": 3}' --accountId <your-account-id>.testnet

# Reset counter to zero
near call <your-account-id>.testnet reset '{}' --accountId <your-account-id>.testnet
```

<br />

## 4. Run Tests

The contract includes comprehensive tests using the [near-pytest](https://github.com/r-near/near-pytest) framework:

```bash
# Install test dependencies
uv sync

# Run tests
uv run pytest
```

<br />

## Project Structure

```
contract-py/
├── contract.py              # Main contract code
├── tests/
│   └── test_mod.py          # Contract tests
├── pyproject.toml           # Project configuration
├── uv.lock                  # Dependency lock file
├── .python-version          # Python version specification
├── .gitignore               # Git ignore rules
└── README.md                
```

<br />

## Useful Links

- [near-sdk-py](https://github.com/r-near/near-sdk-py) - NEAR smart contract development SDK for Python
- [near-pytest](https://github.com/r-near/near-pytest) - Testing framework for NEAR smart contracts
- [NEAR CLI-rs](https://near.cli.rs) - Interact with NEAR blockchain from command line
- [NEAR Python Documentation](https://docs.near.org/tools/near-api)
- [NEAR Documentation](https://docs.near.org)
- [NEAR StackOverflow](https://stackoverflow.com/questions/tagged/nearprotocol)
- [NEAR Discord](https://near.chat)
- [NEAR Telegram Developers Community Group](https://t.me/neardev)
- NEAR DevHub: [Telegram](https://t.me/neardevhub), [Twitter](https://twitter.com/neardevhub)
