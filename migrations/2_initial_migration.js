var conversionAction = artifacts.require("./conversionAction.sol");

module.exports = function(deployer) {
  deployer.deploy(conversionAction);
};
