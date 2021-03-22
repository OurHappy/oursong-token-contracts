const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const tryCatch = require("./exceptions.js").tryCatch;
const errTypes = require("./exceptions.js").errTypes;

const OurAdmin = artifacts.require('OurAdmin');
const OurSongFToken = artifacts.require('OurSongFToken');

contract('OurSongFToken', function (accounts) {
    const [ initialHolder, recipient, anotherAccount, fourthAccount ] = accounts;

    const TOKEN_NAME = 'OURSONG NFT 1155';
    const TOKEN_SYMBOL = 'OURNFT1155';
    const INITIAL_URI = 'https://stage.oursong.com/project/erc1155token-meta/{id}.json';
    const NEW_URI = 'https://www.oursong.com/project/erc1155token-meta/{id}.json';

    const mintABI = {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const mintBatchABI = {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "mintBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const safeTransferFromABI = {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const burnABI = {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const pauseABI = {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const unpauseABI = {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const setURIABI = {
      "inputs": [
        {
            "internalType": "string",
            "name": "uri_",
            "type": "string"
        }
      ],
      "name": "setURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const setContractURIABI = {
        "inputs": [
            {
                "internalType": "string",
                "name": "contractURI_",
                "type": "string"
            }
        ],
        "name": "setContractURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }

    beforeEach(async function () {
        this.ourAdmin = await OurAdmin.new();
        await this.ourAdmin.setWhiteList(initialHolder, 1);
        await this.ourAdmin.setWhiteList(anotherAccount, 1);
        this.fToken = await OurSongFToken.new(INITIAL_URI);
        await this.fToken.mint(this.ourAdmin.address, 0, 10, '0x');
        await this.fToken.transferOwnership(this.ourAdmin.address);
    });

    describe('should met initial settings', async () => {
        it('has a name', async function () {
            expect(await this.fToken.name()).to.equal(TOKEN_NAME);
        });

        it('has a symbol', async function () {
            expect(await this.fToken.symbol()).to.equal(TOKEN_SYMBOL);
        });

        it('met initial uri with uri', async function () {
            expect(await this.fToken.uri(0)).to.be.bignumber.equal(INITIAL_URI);
        });

        it('met initial owner with owenr', async function () {
            expect(await this.fToken.owner()).to.equal(this.ourAdmin.address);
        });
    });

    describe('should have right balance after mint', async function () {
        it('can not mint by not admin', async function () {
            await expectRevert(
              this.fToken.mint(initialHolder, 1, 100, '0x', { from: recipient }),
              'Ownable: caller is not the owner'
            );
        });

        it('can not mint by admin not through admin contract', async function () {
            await expectRevert(
              this.fToken.mint(initialHolder, 1, 100, '0x', { from: initialHolder }),
              'Ownable: caller is not the owner'
            );
        });

        it('can mint by admin through admin contract', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1, 100, '0x']);
            let receipt = await this.ourAdmin.execute(this.fToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2, 200, '0x']);
            receipt = await this.ourAdmin.execute(this.fToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2, 300, '0x']);
            receipt = await this.ourAdmin.execute(this.fToken.address, mintCallData, 3, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(this.ourAdmin.address, 0)).to.be.bignumber.equal(new BN(10));
            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(100));
            expect(await this.fToken.balanceOf(this.ourAdmin.address, 2)).to.be.bignumber.equal(new BN(500));
        });

        it('can not mint by not admin through admin contract', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1, 100, '0x']);

            await tryCatch(this.ourAdmin.execute(this.fToken.address, mintCallData, 2, { from: fourthAccount }), errTypes.revert);
        });

        it('can batch mint by admin through admin contract', async function () {
            let mintBatchCallData = web3.eth.abi.encodeFunctionCall(
                mintBatchABI,
                [
                    this.ourAdmin.address,
                    [1, 2],
                    [100, 200],
                    '0x'
                ]
            );
            let receipt = await this.ourAdmin.execute(this.fToken.address, mintBatchCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(this.ourAdmin.address, 0)).to.be.bignumber.equal(new BN(10));
            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(100));
            expect(await this.fToken.balanceOf(this.ourAdmin.address, 2)).to.be.bignumber.equal(new BN(200));
        });
    });

    describe('should have right balance after transfer', async function () {
        it('can transfer by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1, 100, '0x']);
            let receipt = await this.ourAdmin.execute(this.fToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(100));

            let safeTransferFromCallData = web3.eth.abi.encodeFunctionCall(safeTransferFromABI, [this.ourAdmin.address, recipient, 1, 9, '0x']);
            receipt = await this.ourAdmin.execute(this.fToken.address, safeTransferFromCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(recipient, 1)).to.be.bignumber.equal(new BN(9));
            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(91));

            await expectRevert(
                this.fToken.safeTransferFrom(recipient, initialHolder, 1, 3, '0x', { from: initialHolder }),
                'ERC1155: caller is not owner nor approved'
            );

            await this.fToken.safeTransferFrom(recipient, initialHolder, 1, 3, '0x', { from: recipient });

            expect(await this.fToken.balanceOf(initialHolder, 1)).to.be.bignumber.equal(new BN(3));
        });
    });

    describe('should have burn function', async function () {
        it('can burn by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1, 100, '0x']);
            let receipt = await this.ourAdmin.execute(this.fToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(100));

            let burnCallData = web3.eth.abi.encodeFunctionCall(burnABI, [this.ourAdmin.address, 1, 3]);
            receipt = await this.ourAdmin.execute(this.fToken.address, burnCallData, 3, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.balanceOf(this.ourAdmin.address, 1)).to.be.bignumber.equal(new BN(97));
        });
    });

    describe('should have pause/unpause function', async function () {
        it('can pause/unpause by admin', async function () {
            expect(await this.fToken.paused()).equal(false);

            let pauseCallData = web3.eth.abi.encodeFunctionCall(pauseABI, []);
            let receipt = await this.ourAdmin.execute(this.fToken.address, pauseCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.paused()).equal(true);

            let unpauseCallData = web3.eth.abi.encodeFunctionCall(unpauseABI, []);
            receipt = await this.ourAdmin.execute(this.fToken.address, unpauseCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.paused()).equal(false);
        });

        it('can not pause/unpause by not admin', async function () {
            expect(await this.fToken.paused()).equal(false);

            await expectRevert(
                this.fToken.pause({ from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            await expectRevert(
                this.fToken.unpause({ from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.fToken.paused()).equal(false);
        });
    });

    describe('should have set URI function', async function () {
        it('can set URI by admin', async function () {
            expect(await this.fToken.uri(1)).to.equal(INITIAL_URI);

            let setURICallData = web3.eth.abi.encodeFunctionCall(setURIABI, [NEW_URI]);
            let receipt = await this.ourAdmin.execute(this.fToken.address, setURICallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.uri(1)).to.equal(NEW_URI);
        });

        it('can not set URI by not admin', async function () {
            expect(await this.fToken.uri(1)).to.equal(INITIAL_URI);

            await expectRevert(
                this.fToken.setURI(NEW_URI, { from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.fToken.uri(1)).to.equal(INITIAL_URI);
        });
    });

    describe('should have set contract URI function', async function () {
        it('can set contract URI by admin', async function () {
            expect(await this.fToken.contractURI()).to.equal(INITIAL_URI);

            let setContractURICallData = web3.eth.abi.encodeFunctionCall(setContractURIABI, [NEW_URI]);
            let receipt = await this.ourAdmin.execute(this.fToken.address, setContractURICallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.fToken.contractURI()).to.equal(NEW_URI);
        });

        it('can not set contract URI by not admin', async function () {
            expect(await this.fToken.contractURI()).to.equal(INITIAL_URI);

            await expectRevert(
                this.fToken.setContractURI(NEW_URI, { from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.fToken.contractURI()).to.equal(INITIAL_URI);
        });
    });
});