var OurCoin = artifacts.require('OurCoin');

contract('OurCoin', function (accounts) {

    const INITIAL_SUPPLY = 777777777000000000000000000;

    it('should met initial supply', async () => {
        let contract = await OurCoin.deployed('OurCoin', 'OUR', 18, INITIAL_SUPPLY);
        // check init balance
        let account0Balance = await contract.balanceOf(accounts[0]);
        let totalSupply = await contract.totalSupply.call();
        assert.equal(account0Balance.toNumber(), totalSupply.toNumber());
    });
});