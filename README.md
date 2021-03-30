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

Contract Address: 0xfaB1AC26cCF09E99092d8e9C5662899c8E5F3912

Transaction: https://rinkeby.etherscan.io/tx/0x0ed1ad0434437b07c2f73de41cb730731e4e394dd55dfb98b6e4c801cc3d1349

### OurSongNFTTokenFactory

Contract Address: 0xAF7A1cC61Cb267F1f7a35a26Fe86D96419E2B324

Transaction: https://rinkeby.etherscan.io/tx/0x3f922e404cbd81d13678f90d509cf010aabee5cdae8f8c5b6e395fa82647399a

