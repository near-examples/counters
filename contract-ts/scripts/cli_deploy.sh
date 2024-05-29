#!/bin/bash
# generate random account
uuid=$(uuidgen | tr 'A-Z' 'a-z')
CONTRACT="counter-"${uuid:0:10}".testnet"

near create-account $CONTRACT --useFaucet
near deploy $CONTRACT ./build/counter.wasm
