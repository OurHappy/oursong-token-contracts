const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const tryCatch = require("./exceptions.js").tryCatch;
const errTypes = require("./exceptions.js").errTypes;

const SSTAdminContract = artifacts.require('SSTAdminContract');
const OurSongNFToken = artifacts.require('OurSongNFToken');

contract('OurSongNFToken', function (accounts) {
    const [ initialHolder, recipient, anotherAccount, fourthAccount ] = accounts;

    const TOKEN_NAME = 'OurSongNFToken';
    const TOKEN_SYMBOL = 'OSNFT';
    const INITIAL_SUPPLY = new BN(5);
    const ADD_SUPPLY = new BN(2);
    const INITIAL_BASE_URI = 'https://www.oursong.com/project/custom_id/token/';
    const NEW_BASE_URI = 'https://new.oursong.com/project/custom_id/token/';

    const mintABI = {
        "inputs": [
            {
                "internalType": "address",
                "name": "to_",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId_",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const trasferFromABI = {
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
                "name": "tokenId",
                "type": "uint256"
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
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    const addTotalSupplyABI = {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount_",
                "type": "uint256"
            }
        ],
        "name": "addTotalSupply",
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

    const setBaseURIABI = {
      "inputs": [
        {
          "internalType": "string",
          "name": "baseURI_",
          "type": "string"
        }
      ],
      "name": "setBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const transferOwnershipABI = {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    beforeEach(async function () {
        this.sstAdmin = await SSTAdminContract.new();
        await this.sstAdmin.setWhiteList(initialHolder, 1);
        await this.sstAdmin.setWhiteList(anotherAccount, 1);
        this.nfToken = await OurSongNFToken.new(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY, INITIAL_BASE_URI, this.sstAdmin.address);
    });

    describe('should met initial settings', async () => {
        it('has a name', async function () {
            expect(await this.nfToken.name()).to.equal(TOKEN_NAME);
        });

        it('has a symbol', async function () {
            expect(await this.nfToken.symbol()).to.equal(TOKEN_SYMBOL);
        });

        it('met initial supply with total supply', async function () {
            expect(await this.nfToken.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY);
        });

        it('met initial base uri with base uri', async function () {
            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(INITIAL_BASE_URI);
        });

        it('met initial owner with owenr', async function () {
            expect(await this.nfToken.owner()).to.equal(this.sstAdmin.address);
        });
    });

    describe('should have right balance after mint', async function () {
        it('can not mint by not admin', async function () {
            await expectRevert(
              this.nfToken.mint(initialHolder, 1, { from: recipient }),
              'Ownable: caller is not the owner'
            );
        });

        it('can not mint by admin not through admin contract', async function () {
            await expectRevert(
              this.nfToken.mint(initialHolder, 1, { from: initialHolder }),
              'Ownable: caller is not the owner'
            );
        });

        it('can mint by admin through admin contract', async function () {

            expect(await this.nfToken.balanceOf(this.sstAdmin.address)).to.be.bignumber.equal(new BN(0));

            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 1]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 2]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 2]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 3, { from: anotherAccount });
            expectEvent(receipt, 'ExecutionFailure');

            expect(await this.nfToken.balanceOf(this.sstAdmin.address)).to.be.bignumber.equal(new BN(2));
        });

        it('can not mint by not admin through admin contract', async function () {

            expect(await this.nfToken.balanceOf(this.sstAdmin.address)).to.be.bignumber.equal(new BN(0));

            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 1]);

            await tryCatch(this.sstAdmin.execute(this.nfToken.address, mintCallData, 2, { from: fourthAccount }), errTypes.revert);

            expect(await this.nfToken.balanceOf(this.sstAdmin.address)).to.be.bignumber.equal(new BN(0));
        });

        it('can transfer admin and can not mint invalid token id', async function () {
            let transferOwnershipCallData = web3.eth.abi.encodeFunctionCall(transferOwnershipABI, [initialHolder]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, transferOwnershipCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            await this.nfToken.mint(initialHolder, 1, { from: initialHolder });

            expect(await this.nfToken.ownerOf(1)).to.equal(initialHolder);

            await expectRevert(
                this.nfToken.mint(initialHolder, 0, { from: initialHolder }),
                'Mint: token id must not be zero'
            );

            await expectRevert(
                this.nfToken.mint(initialHolder, 6, { from: initialHolder }),
                'Mint: token id must not bigger than total supply'
            );
        });
    });

    describe('should have right balance after transfer', async function () {
        it('can transfer by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 1]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(this.sstAdmin.address);

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 2]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(2)).to.equal(this.sstAdmin.address);

            expect(await this.nfToken.balanceOf(this.sstAdmin.address)).to.be.bignumber.equal(new BN(2));

            let transferFromCallData = web3.eth.abi.encodeFunctionCall(trasferFromABI, [this.sstAdmin.address, recipient, 1]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, transferFromCallData, 3, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(recipient);

            await expectRevert(
                this.nfToken.transferFrom(recipient, initialHolder, 1, { from: initialHolder }),
                'ERC721: transfer caller is not owner nor approved'
            );

            await this.nfToken.transferFrom(recipient, initialHolder, 1, { from: recipient });

            expect(await this.nfToken.ownerOf(1)).to.equal(initialHolder);
        });
    });

    describe('should have burn function', async function () {
        it('can burn by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 1]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(this.sstAdmin.address);

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.sstAdmin.address, 2]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(2)).to.equal(this.sstAdmin.address);

            let burnCallData = web3.eth.abi.encodeFunctionCall(burnABI, [1]);
            receipt = await this.sstAdmin.execute(this.nfToken.address, burnCallData, 3, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            await expectRevert(
                this.nfToken.ownerOf(1),
                'ERC721: owner query for nonexistent token'
            );
        });
    });

    describe('should have add total supply function', async function () {
        it('can add total supply by admin', async function () {
            expect(await this.nfToken.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY);

            let addTotalSupplyCallData = web3.eth.abi.encodeFunctionCall(addTotalSupplyABI, [ADD_SUPPLY]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, addTotalSupplyCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY.add(ADD_SUPPLY));
        });
    });

    describe('should have pause/unpause function', async function () {
        it('can pause/unpause by admin', async function () {
            expect(await this.nfToken.paused()).equal(false);

            let pauseCallData = web3.eth.abi.encodeFunctionCall(pauseABI, []);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, pauseCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.paused()).equal(true);

            let unpauseCallData = web3.eth.abi.encodeFunctionCall(unpauseABI, []);
            receipt = await this.sstAdmin.execute(this.nfToken.address, unpauseCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.paused()).equal(false);
        });
    });

    describe('should have set base URI function', async function () {
        it('can set base URI by admin', async function () {
            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(INITIAL_BASE_URI);

            let setBaseURICallData = web3.eth.abi.encodeFunctionCall(setBaseURIABI, [NEW_BASE_URI]);
            let receipt = await this.sstAdmin.execute(this.nfToken.address, setBaseURICallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(NEW_BASE_URI);
        });

        it('can not set base URI by not admin', async function () {
            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(INITIAL_BASE_URI);

            await expectRevert(
                this.nfToken.setBaseURI(NEW_BASE_URI, { from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(INITIAL_BASE_URI);
        });
    });
});