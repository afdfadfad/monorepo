import {State, validTransition} from "@statechannels/nitro-protocol";
import NetworkContext from "@statechannels/nitro-protocol/ganache/ganache-network-context.json";
import {ethers} from "ethers";
import {AddressZero} from "ethers/constants";
import log from "loglevel";

log.setDefaultLevel(log.levels.DEBUG);

let networkMap;

export function getContractAddress(contractName) {
  console.info(`Getting contract ${contractName}`);
  networkMap = networkMap || NetworkContext;
  // log.info(`Getting contract address: ${contractName}`);
  // log.info(`with network map`);
  // log.info(networkMap[contractName].address);
  if (networkMap && networkMap[contractName]) {
    return networkMap[contractName].address;
  }
  console.error(contractName, networkMap);

  throw new Error(`Could not find ${contractName} in network map ${JSON.stringify(networkMap)}}`);
}

export async function getProvider(): Promise<ethers.providers.Web3Provider> {
  return await new ethers.providers.Web3Provider(web3.currentProvider);
}

export async function getAdjudicatorContract(provider) {
  await provider.ready;

  const contractAddress = getContractAddress("NitroAdjudicator");
  return new ethers.Contract(contractAddress, getAdjudicatorInterface(), provider);
}

export async function getETHAssetHolderContract(provider) {
  await provider.ready;

  const contractAddress = getContractAddress("ETHAssetHolder");
  return new ethers.Contract(contractAddress, getETHAssetHolderInterface(), provider);
}

export function getAdjudicatorInterface(): ethers.utils.Interface {
  // TODO: update these to use the ABI from the network context
  const NitroAdjudicatorArtifact = require("../../build/contracts/NitroAdjudicator.json");
  return new ethers.utils.Interface(NitroAdjudicatorArtifact.abi);
}

export function getETHAssetHolderInterface(): ethers.utils.Interface {
  // TODO: update these to use the ABI from the network context
  const ETHAssetHolderArtifact = require("../../build/contracts/ETHAssetHolder.json");
  return new ethers.utils.Interface(ETHAssetHolderArtifact.abi);
}

// FIXME: The tests ought to be able to run even without contracts having been built which
// is why this try {} catch {} logic is here, but returning AddressZero is only a way of
// avoiding errors being thrown. The situation is that all tests which actually interact
// with the blockchain are currently skipped, and so the AddressZero value is never used.

export function getTrivialAppAddress(): string {
  try {
    return getContractAddress("TrivialApp");
  } catch (e) {
    return AddressZero;
  }
}

export function getETHAssetHolderAddress(): string {
  try {
    return getContractAddress("ETHAssetHolder");
  } catch (e) {
    return AddressZero;
  }
}

export function getAdjudicatorContractAddress(): string {
  try {
    return getContractAddress("NitroAdjudicator");
  } catch (e) {
    return AddressZero;
  }
}

export function getConsensusContractAddress(): string {
  try {
    return getContractAddress("ConsensusApp");
  } catch (e) {
    return AddressZero;
  }
}

export function getNetworkId(): number {
  log.info(`Getting chain network ID: ${process.env.CHAIN_NETWORK_ID}`);
  if (!!process.env.CHAIN_NETWORK_ID) {
    return parseInt(process.env.CHAIN_NETWORK_ID, 10);
  } else {
    throw new Error("There is no target network ID specified.");
  }
}

export function isDevelopmentNetwork(): boolean {
  const networkId = getNetworkId();

  return (
    networkId > 8 && // various test nets
    networkId !== 42 && // kovan
    networkId !== 60 && // go chain
    networkId !== 77 && // sokol
    networkId !== 99 && // core
    networkId !== 100 && // xDai
    networkId !== 31337 && // go chain test
    networkId !== 401697 && // tobalaba
    networkId !== 7762959 && // musicoin
    networkId !== 61717561 // aquachain
  );
}
// TODO: Update to work with nitro protocol
// export async function getAdjudicatorHoldings(provider, channelId) {
//   const contract = await getAdjudicatorContract(provider);
//   const holdingForChannel = await contract.holdings(channelId);
//   return holdingForChannel;
// }

// export async function getAdjudicatorOutcome(provider, channelId) {
//   const contract = await getAdjudicatorContract(provider);
//   const outcomeForChannel = await contract.outcomes(channelId);
//   return outcomeForChannel;
// }

export async function validateTransition(
  fromState: State,
  toState: State,
  privateKey: string
): Promise<boolean> {
  const contractAddress = getAdjudicatorContractAddress();
  const wallet = new ethers.Wallet(privateKey);
  try {
    return await validTransition(fromState, toState, contractAddress, wallet);
  } catch (error) {
    if (error.message === "Internal JSON-RPC error.") {
      // Require statements cause a generic JSON-RPC error, so we just catch anything and return false
      return Promise.resolve(false);
    } else {
      throw error;
    }
  }
}
