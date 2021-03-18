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