var SSTAdminContract = artifacts.require("SSTAdminContract");
var OurCoin = artifacts.require("OurCoin");
var OurSongFToken = artifacts.require("OurSongFToken");
var OurSongNFToken = artifacts.require("OurSongNFToken");

module.exports = function (deployer) {
    deployer.deploy(SSTAdminContract);
    deployer.deploy(OurCoin, 'OurCoin', 'OUR', 777777777);
    deployer.deploy(OurSongFToken, 'https://stage.oursong.com/project/erc1155token/{id}.json');
    deployer.deploy(OurSongNFToken, 'OurSongNFToken', 'OSNFT', 'https://stage.oursong.com/project/custom_id/token/');
};