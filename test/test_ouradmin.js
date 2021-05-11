const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const tryCatch = require("./exceptions.js").tryCatch;
const errTypes = require("./exceptions.js").errTypes;

const OurAdmin = artifacts.require('OurAdmin');
const OurCoin = artifacts.require('OurCoin');

const transferABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }
    ],
    "name": "transfer",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
};

contract('OurAdmin', function (accounts) {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    const TOKEN_NAME = 'OurCoin';
    const TOKEN_SYMBOL = 'OUR';
    const TOKEN_DECIMAL = new BN(18);
    const INITIAL_SUPPLY = new BN(42000000);
    const TRANSFER_AMOUNT = new BN(123);

    beforeEach(async function () {
        this.ourAdmin = await OurAdmin.new({ from: initialHolder });
        await this.ourAdmin.setWhiteList(initialHolder, 1);

        this.token = await OurCoin.new(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMAL, INITIAL_SUPPLY, { from: initialHolder });
        await this.token.transfer(this.ourAdmin.address, INITIAL_SUPPLY, { from: initialHolder });
    });

    it('can excute by white listed admin', async function () {
        expect(await this.token.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(INITIAL_SUPPLY);

        let transferCallData = web3.eth.abi.encodeFunctionCall(transferABI, [recipient, String(TRANSFER_AMOUNT)]);
        receipt = await this.ourAdmin.execute(this.token.address, transferCallData, 1, { from: initialHolder });
        expectEvent(receipt, 'Execution');

        transferCallData = web3.eth.abi.encodeFunctionCall(transferABI, [recipient, String(TRANSFER_AMOUNT)]);
        await tryCatch(this.ourAdmin.execute(this.token.address, transferCallData, 1, { from: initialHolder }), errTypes.revert);

        transferCallData = web3.eth.abi.encodeFunctionCall(transferABI, [anotherAccount, String(TRANSFER_AMOUNT)]);
        await tryCatch(this.ourAdmin.execute(this.token.address, transferCallData, 2, { from: recipient }), errTypes.revert);

        expect(await this.token.balanceOf(this.ourAdmin.address)).to.be.bignumber.equal(INITIAL_SUPPLY.sub(TRANSFER_AMOUNT));
        expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(TRANSFER_AMOUNT);
    });

    it('can set white list admin', async function () {
        expect(await this.ourAdmin.isInWhiteList(recipient)).to.equal(false);

        await tryCatch(this.ourAdmin.setWhiteList(recipient, 1, { from: recipient }), errTypes.revert);
        await this.ourAdmin.setWhiteList(recipient, 1, { from: initialHolder });

        expect(await this.ourAdmin.isInWhiteList(recipient)).to.equal(true);
    });

    it('can transfer ownership', async function () {
        expect(await this.ourAdmin.getOwner()).to.equal(initialHolder);
        expect(await this.ourAdmin.getNewOwner()).to.equal('0x0000000000000000000000000000000000000000');

        await this.ourAdmin.transferOwnership(anotherAccount, { from: initialHolder });

        expect(await this.ourAdmin.getOwner()).to.equal(initialHolder);
        expect(await this.ourAdmin.getNewOwner()).to.equal(anotherAccount);

        await tryCatch(this.ourAdmin.claimOwner({ from: initialHolder }), errTypes.revert);
        await this.ourAdmin.claimOwner({ from: anotherAccount });

        expect(await this.ourAdmin.getOwner()).to.equal(anotherAccount);
        expect(await this.ourAdmin.getNewOwner()).to.equal(anotherAccount);
    });

    /*it('can drop self', async function () {
        expect(await this.ourAdmin.isSuspend()).to.equal(false);

        await this.ourAdmin.dropSelf({ from: initialHolder });

        expect(await this.ourAdmin.isSuspend()).to.equal(true);

        let transferCallData = web3.eth.abi.encodeFunctionCall(transferABI, [recipient, TRANSFER_AMOUNT]);
        await tryCatch(this.ourAdmin.execute(this.token.address, transferCallData, 1, { from: initialHolder }), errTypes.revert);
        await tryCatch(this.ourAdmin.setWhiteList(recipient, 1, { from: initialHolder }), errTypes.revert);
    });*/
});