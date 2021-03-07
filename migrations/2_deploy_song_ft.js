var SongFToken = artifacts.require("SongFToken");

module.exports = function (deployer) {
    deployer.deploy(SongFToken, 'SongFToken@', 'SFT@', 2, 888888);
};