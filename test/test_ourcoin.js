var OurCoin = artifacts.require('OurCoin');

contract('OurCoin', function (accounts) {

    const INITIAL_SUPPLY = 777777777000000000000000000;
    const AMOUNT = 123;

    it('should met initial supply', async () => {
        let contract = await OurCoin.deployed('OurCoin', 'OUR', 18, INITIAL_SUPPLY);
        // check init balance
        let account0Balance = await contract.balanceOf(accounts[0]);
        let totalSupply = await contract.totalSupply.call();
        assert.equal(account0Balance.toNumber(), totalSupply.toNumber());
    });

    it('should have right balance after transfer', async function () {
        let contract = await OurCoin.deployed('OurCoin', 'OUR', 18, INITIAL_SUPPLY);
        // check init balance
        let account0Balance = await contract.balanceOf(accounts[0]);
        let account1Balance = await contract.balanceOf(accounts[1]);
        let totalSupply = await contract.totalSupply.call();
        assert.equal(account0Balance.toNumber(), totalSupply.toNumber());
        assert.equal(account1Balance.toNumber(), 0);
        // check balance after transferred
        await contract.transfer(accounts[1], AMOUNT, { from: accounts[0] });
        account0Balance = await contract.balanceOf(accounts[0]);
        account1Balance = await contract.balanceOf(accounts[1]);
        console.log(account0Balance.toNumber());
        console.log(account1Balance.toNumber());
        assert.equal(account0Balance.toNumber(), totalSupply.toNumber() - AMOUNT);
        assert.equal(account1Balance.toNumber(), AMOUNT);
    });
});