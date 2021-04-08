const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const tryCatch = require("./exceptions.js").tryCatch;
const errTypes = require("./exceptions.js").errTypes;

const OurAdmin = artifacts.require('OurAdmin');
const OurSongNFTokenFactory = artifacts.require('OurSongNFTokenFactory');
const OurSongNFToken = artifacts.require('OurSongNFToken');

contract('OurSongNFToken', function (accounts) {
    const [ initialHolder, recipient, anotherAccount, fourthAccount ] = accounts;

    const TOKEN_NAME = 'OurSongNFToken';
    const TOKEN_SYMBOL = 'OSNFT';
    const INITIAL_BASE_URI = 'https://stage.oursong.com/project/custom_id/erc721token-meta/';
    const NEW_BASE_URI = 'https://www.oursong.com/project/custom_id/erc721token-meta/';

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
        this.ourAdmin = await OurAdmin.new();
        await this.ourAdmin.setWhiteList(initialHolder, 1);
        await this.ourAdmin.setWhiteList(anotherAccount, 1);
        this.nfTokenFactory = await OurSongNFTokenFactory.new(this.ourAdmin.address);
        let receipt = await this.nfTokenFactory.createOurSongNFToken(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_BASE_URI, INITIAL_BASE_URI, { from: initialHolder });
        let newContractAddress = receipt.receipt.logs[0].args.newContract;

        this.nfToken = new OurSongNFToken(newContractAddress);
    });

    describe('should met initial settings', async () => {
        it('has a name', async function () {
            expect(await this.nfToken.name()).to.equal(TOKEN_NAME);
        });

        it('has a symbol', async function () {
            expect(await this.nfToken.symbol()).to.equal(TOKEN_SYMBOL);
        });

        it('met initial base uri with base uri', async function () {
            expect(await this.nfToken.baseURI()).to.be.bignumber.equal(INITIAL_BASE_URI);
        });

        it('met initial owner with owenr', async function () {
            expect(await this.nfToken.owner()).to.equal(this.ourAdmin.address);
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

            expect(await this.nfToken.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(new BN(0));

            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1]);
            let receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 3, { from: anotherAccount });
            expectEvent(receipt, 'ExecutionFailure');

            expect(await this.nfToken.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(new BN(2));
        });

        it('can not mint by not admin through admin contract', async function () {

            expect(await this.nfToken.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(new BN(0));

            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1]);

            await tryCatch(this.ourAdmin.execute(this.nfToken.address, mintCallData, 2, { from: fourthAccount }), errTypes.revert);

            expect(await this.nfToken.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(new BN(0));
        });
    });

    describe('should have right balance after transfer', async function () {
        it('can transfer by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1]);
            let receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(this.ourAdmin.address);

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(2)).to.equal(this.ourAdmin.address);

            expect(await this.nfToken.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(new BN(2));

            let transferFromCallData = web3.eth.abi.encodeFunctionCall(safeTransferFromABI, [this.ourAdmin.address, recipient, 1]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, transferFromCallData, 3, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(recipient);

            await expectRevert(
                this.nfToken.safeTransferFrom(recipient, initialHolder, 1, { from: initialHolder }),
                'ERC721: transfer caller is not owner nor approved'
            );

            await this.nfToken.transferFrom(recipient, initialHolder, 1, { from: recipient });

            expect(await this.nfToken.ownerOf(1)).to.equal(initialHolder);
        });
    });

    describe('should have burn function', async function () {
        it('can burn by token owner', async function () {
            let mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 1]);
            let receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(1)).to.equal(this.ourAdmin.address);

            mintCallData = web3.eth.abi.encodeFunctionCall(mintABI, [this.ourAdmin.address, 2]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, mintCallData, 2, { from: anotherAccount });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.ownerOf(2)).to.equal(this.ourAdmin.address);

            let burnCallData = web3.eth.abi.encodeFunctionCall(burnABI, [1]);
            receipt = await this.ourAdmin.execute(this.nfToken.address, burnCallData, 3, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            await expectRevert(
                this.nfToken.ownerOf(1),
                'ERC721: owner query for nonexistent token'
            );
        });
    });

    describe('should have set base URI function', async function () {
        it('can set base URI by admin', async function () {
            expect(await this.nfToken.baseURI()).to.equal(INITIAL_BASE_URI);

            let setBaseURICallData = web3.eth.abi.encodeFunctionCall(setBaseURIABI, [NEW_BASE_URI]);
            let receipt = await this.ourAdmin.execute(this.nfToken.address, setBaseURICallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.baseURI()).to.equal(NEW_BASE_URI);
        });

        it('can not set base URI by not admin', async function () {
            expect(await this.nfToken.baseURI()).to.equal(INITIAL_BASE_URI);

            await expectRevert(
                this.nfToken.setBaseURI(NEW_BASE_URI, { from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.nfToken.baseURI()).to.equal(INITIAL_BASE_URI);
        });
    });

    describe('should have set contract URI function', async function () {
        it('can set contract URI by admin', async function () {
            expect(await this.nfToken.contractURI()).to.equal(INITIAL_BASE_URI);

            let setContractURICallData = web3.eth.abi.encodeFunctionCall(setContractURIABI, [NEW_BASE_URI]);
            let receipt = await this.ourAdmin.execute(this.nfToken.address, setContractURICallData, 1, { from: initialHolder });
            expectEvent(receipt, 'Execution');

            expect(await this.nfToken.contractURI()).to.equal(NEW_BASE_URI);
        });

        it('can not set contract URI by not admin', async function () {
            expect(await this.nfToken.contractURI()).to.equal(INITIAL_BASE_URI);

            await expectRevert(
                this.nfToken.setContractURI(NEW_BASE_URI, { from: initialHolder }),
                'Ownable: caller is not the owner'
            );

            expect(await this.nfToken.contractURI()).to.equal(INITIAL_BASE_URI);
        });
    });
});