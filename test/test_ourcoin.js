const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const OurCoin = artifacts.require('OurCoin');

contract('OurCoin', function (accounts) {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    const TOKEN_NAME = 'OurCoin';
    const TOKEN_SYMBOL = 'OUR';
    const TOKEN_DECIMAL = new BN(18);
    const INITIAL_SUPPLY = new BN(42000000); // 42000000000000000000000000
    const TRANSFER_AMOUNT = new BN(123);
    const BURN_AMOUNT = new BN(456);

    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const PAUSER_ROLE = web3.utils.keccak256("PAUSER_ROLE");

    beforeEach(async function () {
        this.token = await OurCoin.new(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
    });

    describe('should met initial settings', async () => {

        it('has a name', async function () {
            expect(await this.token.name()).to.equal(TOKEN_NAME);
        });

        it('has a symbol', async function () {
            expect(await this.token.symbol()).to.equal(TOKEN_SYMBOL);
        });

        it('has 18 decimals', async function () {
            expect(await this.token.decimals()).to.be.bignumber.equal(TOKEN_DECIMAL);
        });

        it('met initial supply with total supply', async function () {
            expect(await this.token.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY);
        });

        it('met initial supply with init balance', async function () {
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(INITIAL_SUPPLY);
        });
    });

    describe('should have right balance after transfer', async function () {

        it('met initial balance', async function () {
            let initialHolderBalance = await this.token.balanceOf(initialHolder);
            let recipientBalance = await this.token.balanceOf(recipient);

            expect(initialHolderBalance).to.be.bignumber.equal(INITIAL_SUPPLY);
            expect(recipientBalance).to.be.bignumber.equal(new BN(0));
        });

        it('met balance after transferred', async function () {
            await this.token.transfer(recipient, TRANSFER_AMOUNT, { from: initialHolder });

            let initialHolderBalance = await this.token.balanceOf(initialHolder);
            let recipientBalance = await this.token.balanceOf(recipient);

            expect(initialHolderBalance).to.be.bignumber.equal(INITIAL_SUPPLY.sub(TRANSFER_AMOUNT));
            expect(recipientBalance).to.be.bignumber.equal(TRANSFER_AMOUNT);
        });
    });

    describe('should have right balance after burn', async function () {

        it('met initial balance', async function () {
            expect(await this.token.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY);
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(INITIAL_SUPPLY);
        });

        it('met balance after burned', async function () {
            await this.token.burn(BURN_AMOUNT, { from: initialHolder });

            await expectRevert(
              this.token.burn(BURN_AMOUNT, { from: anotherAccount }),
              'ERC20: burn amount exceeds balance',
            );

            expect(await this.token.totalSupply()).to.be.bignumber.equal(INITIAL_SUPPLY.sub(BURN_AMOUNT));
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(INITIAL_SUPPLY.sub(BURN_AMOUNT));
        });
    });
});