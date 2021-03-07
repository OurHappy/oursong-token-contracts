var SSTAdminContract = artifacts.require('SSTAdminContract');

contract('SSTAdminContract', function (accounts) {

    let sstAdmin;

    beforeEach(async () => {
        sstAdmin = await SSTAdminContract.new({ from: accounts[0] });
    });

    it('should be true', async () => {
        let delegate = web3.eth.abi.encodeFunctionSignature({
            "constant": false,
            "inputs": [
                {
                    "name": "sender",
                    "type": "address"
                },
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "delegateTransfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        });
        console.log(delegate);

        let pauseFunctionCall = web3.eth.abi.encodeFunctionCall({
            name: 'pause',
            type: 'function',
            inputs: []
        }, []);
        console.log(pauseFunctionCall);
        assert.equal(1, 1);
    });
});