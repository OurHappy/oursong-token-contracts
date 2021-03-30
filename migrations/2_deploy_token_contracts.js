var OurAdmin = artifacts.require("OurAdmin");
var OurCoin = artifacts.require("OurCoin");
var OurSongFToken = artifacts.require("OurSongFToken");
var OurSongNFToken = artifacts.require("OurSongNFToken");

module.exports = function (deployer) {
    deployer.deploy(OurAdmin);
    deployer.deploy(OurCoin, 'OurCoin', 'OUR', 42000000);
    deployer.deploy(OurSongFToken, 'https://stage.oursong.com/project/erc1155token-meta/{id}.json');
    deployer.deploy(OurSongNFToken, 'OurSongNFToken', 'OSNFT', 'https://stage.oursong.com/project/custom_id/erc721token-meta/');
};