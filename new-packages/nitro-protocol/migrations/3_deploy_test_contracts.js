const Token = artifacts.require('Token');
const ForceMove = artifacts.require('TESTForceMove');
const NitroAdjudicator = artifacts.require('TESTNitroAdjudicator');
const AssetHolder = artifacts.require('TESTAssetHolder');
const TrivialApp = artifacts.require('TrivialApp');
const CountingApp = artifacts.require('CountingApp');
const TESTETHAssetHolder = artifacts.require('TESTETHAssetHolder');
const ERC20AssetHolder = artifacts.require('ERC20AssetHolder');

module.exports = function(deployer) {
  deployer.then(async () => {
    await Promise.all([deployer.deploy(NitroAdjudicator), deployer.deploy(Token)]);

    const [NitroAdjudicatorInstance, TokenInstance] = await Promise.all([
      NitroAdjudicator.deployed(),
      Token.deployed(),
    ]);

    await deployer.deploy(TESTETHAssetHolder, NitroAdjudicatorInstance.address);
    await deployer.deploy(
      ERC20AssetHolder,
      NitroAdjudicatorInstance.address,
      TokenInstance.address,
    );
  });

  deployer.deploy(AssetHolder);
  deployer.deploy(TrivialApp);
  deployer.deploy(CountingApp);
  deployer.deploy(ForceMove);
};
