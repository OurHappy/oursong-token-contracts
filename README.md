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

Contract Address: 0x7FA783fFaB81D23b66B4B4c25d2bF853989a34eb

Transaction: https://rinkeby.etherscan.io/tx/0x79615e098ade007891b4667f007790f6998ebdd6900a498b489037781e8137f5

### OurSongNFTTokenFactory

Contract Address: 0x00055B7Ab2B89a53f01F8cFAE997CD4dAc6bc3a9

Transaction: https://rinkeby.etherscan.io/tx/0x148eff198616892294a2b2f5872923198cad33620f85c4ef0ca59fe1d41e8cc4

