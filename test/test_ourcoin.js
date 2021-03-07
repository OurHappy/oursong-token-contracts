/*var OurCoin = artifacts.require('OurCoin');

contract('OurCoin', function (accounts) {

    const INITIAL_SUPPLY = 777777777000000000000000000;
    let _totalSupply;

    it('should met initial supply', function () {
        var contract;
        OurCoin.deployed('OurCoin', 'OUR', 18, INITIAL_SUPPLY).then((instance) => {
            contract = instance;
            return contract.totalSupply.call();
        }).then((totalSupply) => {
            _totalSupply = totalSupply;
            assert.equal(totalSupply.toNumber(), INITIAL_SUPPLY);
            return contract.balanceOf(accounts[0]);
        }).then((senderBalance) => {
            assert.equal(_totalSupply.toNumber(), senderBalance.toNumber());
        });
    });
});*/