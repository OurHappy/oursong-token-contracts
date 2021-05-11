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

## Mainnet
### OurAdmin

Contract Address: 0xfaB1AC26cCF09E99092d8e9C5662899c8E5F3912

Transaction: https://etherscan.io/tx/0xe3c533f25eab8c961b39135b287a973f98e635d1fe283b4c615aa83e6377fa07

### OurSongFToken 1155

Contract Address: 0xa42bd534270dd4c934d970429392ce335c79220d

Transaction: https://etherscan.io/tx/0x1031405530eb083698ccf73a4251602c82cc533b6aff64876163c75364084383

### OurSongNFTokenFactory

Contract Address: 0x1bd84320cCd43b968c4d545B4f9A39ac538Dcf11

Transaction: https://etherscan.io/tx/0x5905bed0f7798fb170c90452f0074815e1c7b33dc810b4faad9c3b716464ef2a

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

## BSC Test Net

### OurAdmin

Contract Address: 0xe795DF147D5a4EFBCcaa7c62265554282e4d4C22

Transaction: https://testnet.bscscan.com/tx/0x8757f5ebb4e30788a0e2e063b3e6ecfc1d8a8c13ff1acaffeb837cf28ef72193

WhiteList: 0xE1E8D20B7614Fb5E3Aa400485d88AF300cc5A165,0x8EB25A585cb0643A8c239c69FB1a5C3CE9665e7C

### OurSongFToken 1155

Contract Address: 0x74247aE0D95E5be00ED105aFe03Ad0a98f3aEd8F

Transaction: https://testnet.bscscan.com/tx/0x01014a768258b19bde4e5d5650fde2584765dde1d94755aac1de74ee187eb1ec

### OurSongNFTTokenFactory

Contract Address: 0x47AC3b44eC854bC513Ff99fb8AAC7738fa52acD7

Transaction: https://testnet.bscscan.com/tx/0x56eb5cc0bfea82e2af881d03c8ec7e3644887df0736b7a1bafe1a556e75287e9

### Ourcoin

Contract Address: 0xfaB1AC26cCF09E99092d8e9C5662899c8E5F3912

Transaction: https://testnet.bscscan.com/tx/0x23c58d95a2acb0dbc83393c3db37daf5a322562b375744e8aa7af680db3559a1

## BSC Main Net

### OurAdmin

Contract Address: 0x1942e46c4b69b9D0768608Fc599734884cf8cbA8

Transaction: https://bscscan.com/tx/0xf102762fedc28870bed4856807a6a0969face95ff132d1d4803fde4fce34e153

### OurSongFToken 1155

Contract Address: 0xD41bDc346dfCC6A6acCC219eDC2055005F32B3A4

Transaction: https://bscscan.com/tx/0xe34772d6d2de0e64e0989d90f83c155bfbd9dd1113e8ad5f70d286924d9f08c4

### OurSongNFTTokenFactory

Contract Address: 0xD8b2fEAb43421B512A167021B4e92A59BeA852E1

Transaction: https://bscscan.com/tx/0xbb11796bbe12bcf61fe81ffe6a542ccd8397b1b2fe68cef531f238828a5b409a

### FukuCoin

Contract Address: 0x05BEBd110071E936Eec13f550D88FcF1a3d1FF96

Transaction: https://bscscan.com/tx/0x2f52d2875851392cffae584f89f53637d8165c2a40fb8abe53822f728ad42a73

## ThunderCore Test Net

### OurAdmin

Contract Address: 0xe795DF147D5a4EFBCcaa7c62265554282e4d4C22

Transaction: https://scan-testnet.thundercore.com/transactions/0x240d7f310a0843d6b6f2c09e56392a0fd6e8a0a031a3efb2b4dc879068fcaed9

## OurSongFToken 1155

Contract Address: 0x74247aE0D95E5be00ED105aFe03Ad0a98f3aEd8F

Transaction: https://scan-testnet.thundercore.com/transactions/0xe334e0cf558f94898c8ffb8f4e3fb297f76e72189f1dd2e6ad18ec8115451587

### OurSongNFTTokenFactory

Contract Address: 0x47AC3b44eC854bC513Ff99fb8AAC7738fa52acD7

Transaction: https://scan-testnet.thundercore.com/transactions/0xde1b60362ac52f3e1e459d15ed0a47f17223442ad12885899f4a31a21eec8ce5

## ThunderCore Main Net

### OurAdmin

Contract Address: 0xA39E0b216902688BEc7C7e68d62a6C9c60E31Bfb

Transaction: https://scan.thundercore.com/transactions/0x1732a942fcf1d348e6a431745098b2b29180a782f2f6beffab92ebeeea1da01a

### OurSongFToken 1155

Contract Address: 0x47AC3b44eC854bC513Ff99fb8AAC7738fa52acD7

Transaction: https://scan.thundercore.com/transactions/0x04e3ebbc1ba836b3610ffb27e32318379729f94e068100dbe4a107404f301dba

### OurSongNFTTokenFactory

Contract Address: 0xfaB1AC26cCF09E99092d8e9C5662899c8E5F3912

Transaction: https://scan.thundercore.com/transactions/0xeee02a3ba2cb74da4c85d098833fc368b09e3aad1d9a6ed46c857aaa97f5dc37



