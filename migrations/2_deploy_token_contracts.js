var SSTAdminContract = artifacts.require("SSTAdminContract");
var OurCoin = artifacts.require("OurCoin");
var OurSongFToken = artifacts.require("OurSongFToken");
var OurSongNFToken = artifacts.require("OurSongNFToken");

module.exports = function (deployer) {
    deployer.deploy(SSTAdminContract);
    deployer.deploy(OurCoin, 'OurCoin', 'OUR', 777777777);
    deployer.deploy(OurSongFToken, 'OurSongFToken', 'OSFT', 'https://stage.oursong.com/project/erc1155token/{id}.json', '0x47ac3b44ec854bc513ff99fb8aac7738fa52acd7');
    deployer.deploy(OurSongNFToken, 'OurSongNFToken', 'OSNFT', 3, 'https://stage.oursong.com/project/custom_id/token/', '0x47ac3b44ec854bc513ff99fb8aac7738fa52acd7');
};