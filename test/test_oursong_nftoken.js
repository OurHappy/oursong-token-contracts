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
    });

    describe('should have right balance after transfer', async function () {
        it('can transfer by owner', async function () {
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
});