# OurSong Token Contracts

OurSong Token Contracts

## Install

```
nvm use v14.15.3

npm install
```

## Compile

```
npx truffle compile
```

## Migrate

```
npx truffle migrate
```

## Play with migrated contract

```
npx truffle console
```

## Test

```
npx truffle test
```

## Coverage

```
npx truffle run coverage
```

## Verify on Etherscan

https://forum.openzeppelin.com/t/verify-smart-contract-inheriting-from-openzeppelin-contracts/4119

```
npx truffle run verify OurCoin@0xeD8F9f7E545C745757695Fe628771cA1aEeB8318 --network ropsten
```

```
npx truffle run verify OurSongNFToken@0x8f56CD54e1434d78918FdA42ec39ed9392E0dB3F --network ropsten
```

## Deploy

## Rinkeby

### OurAdmin

Contract Address: 0x1942e46c4b69b9D0768608Fc599734884cf8cbA8

Transaction: https://rinkeby.etherscan.io/tx/0x99e73ee1ac256cfb5782cfe29d175368978d9dd33498d5b5a67b1c72d8a488f8

### OurSongFToken 1155

Contract Address: 0x1bd84320cCd43b968c4d545B4f9A39ac538Dcf11

Transaction: https://rinkeby.etherscan.io/tx/0x798f0d6c4f8c10ea332c26ba27c5278a36e2c31ae0bc90fd0f53c21f597297ca

### OurSongNFTTokenFactory

Contract Address: 0x3F3E8256c88a916AC44C7103C07A4D65ED2bd0D2

Transaction: https://rinkeby.etherscan.io/tx/0xc015db997c17398e96a4167869467da48c79de14f30a2d1e1d74b44d05f31cdd

