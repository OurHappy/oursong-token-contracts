var OurCoin = artifacts.require("OurCoin");
var SongFToken = artifacts.require("SongFToken");
var SongNFToken = artifacts.require("SongNFToken");

module.exports = function (deployer) {
    deployer.deploy(OurCoin, 'OurCoin', 'OUR', 777777777, 18);
    deployer.deploy(SongFToken, 'SongFToken', 'SFT', 1000, 0);
    deployer.deploy(SongNFToken, 'SongNFToken', 'SNFT', 3, 'https://www.oursong.com/s/custom_id/token/');
};