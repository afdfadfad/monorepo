import {ChannelResult, Message, ChannelClientInterface} from '@statechannels/channel-client';
import {bigNumberify} from 'ethers/utils';
import {FakeChannelProvider} from '@statechannels/channel-client';
import {ChannelClient} from '@statechannels/channel-client';
import React from 'react';
import {ChannelStatus} from '@statechannels/client-api-schema';
import {SiteBudget} from '@statechannels/client-api-schema';

export interface ChannelState {
  channelId: string;
  turnNum: string;
  status: ChannelStatus;
  challengeExpirationTime;
  beneficiary: string;
  payer: string;
  beneficiaryOutcomeAddress: string;
  payerOutcomeAddress: string;
  beneficiaryBalance: string;
  payerBalance: string;
}

// This class wraps the channel client converting the
// request/response formats to those used in the app

if (process.env.REACT_APP_FAKE_CHANNEL_PROVIDER === 'true') {
  window.channelProvider = new FakeChannelProvider();
} else {
  // TODO: Replace with injection via other means than direct app import
  // NOTE: This adds `channelProvider` to the `Window` object
  require('@statechannels/channel-provider');
}

// TODO: Put inside better place than here where app can handle error case
window.channelProvider.enable(process.env.REACT_APP_WALLET_URL);

// This Client targets at _unidirectional_, single asset (ETH) payment channel with 2 participants running on Nitro protocol
// The beneficiary proposes the channel, but accepts payments
// The payer joins the channel, and makes payments
export class PaymentChannelClient {
  mySigningAddress?: string;
  myEthereumSelectedAddress?: string; // this state can be inspected to infer whether we need to get the user to "Connect With MetaMask" or not.
  channelCache: Record<string, ChannelState> = {};
  myAddress: string;
  constructor(private readonly channelClient: ChannelClientInterface) {}
  async createChannel(
    beneficiary: string,
    payer: string,
    beneficiaryBalance: string,
    payerBalance: string,
    beneficiaryOutcomeAddress: string,
    payerOutcomeAddress: string
  ): Promise<ChannelState> {
    const participants = formatParticipants(
      beneficiary,
      payer,
      beneficiaryOutcomeAddress,
      payerOutcomeAddress
    );
    const allocations = formatAllocations(
      beneficiaryOutcomeAddress,
      payerOutcomeAddress,
      beneficiaryBalance,
      payerBalance
    );
    const appDefinition = '0x0'; // TODO SingleAssetPayments address

    const channelResult = await this.channelClient.createChannel(
      participants,
      allocations,
      appDefinition,
      'appData unused'
    );
    this.cacheChannelState(convertToChannelState(channelResult));
    return convertToChannelState(channelResult);
  }

  async getAddress() {
    this.mySigningAddress = await this.channelClient.getAddress();
    return this.mySigningAddress;
  }

  async getEthereumSelectedAddress() {
    this.myEthereumSelectedAddress = window.ethereum.selectedAddress;
    // this.myEthereumSelectedAddress = await this.channelClient.getEthereumSelectedAddress();
    return this.myEthereumSelectedAddress;
  }

  onMessageQueued(callback: (message: Message) => void) {
    return this.channelClient.onMessageQueued(callback);
  }

  cacheChannelState(channelState: ChannelState) {
    this.channelCache = {...this.channelCache, [channelState.channelId]: channelState};
  }

  // Accepts an web3t-friendly callback, performs the necessary encoding, and subscribes to the channelClient with an appropriate, API-compliant callback
  onChannelUpdated(web3tCallback: (channelState: ChannelState) => any) {
    function callback(channelResult: ChannelResult): any {
      web3tCallback(convertToChannelState(channelResult));
    }
    const unsubChannelUpdated = this.channelClient.onChannelUpdated(callback);
    return () => {
      unsubChannelUpdated();
    };
  }

  onChannelProposed(web3tCallback: (channelState: ChannelState) => any) {
    function callback(channelResult: ChannelResult): any {
      web3tCallback(convertToChannelState(channelResult));
    }
    const unsubChannelProposed = this.channelClient.onChannelProposed(callback);
    return () => {
      unsubChannelProposed();
    };
  }

  async joinChannel(channelId: string) {
    const channelResult = await this.channelClient.joinChannel(channelId);
    this.cacheChannelState(convertToChannelState(channelResult));
    return convertToChannelState(channelResult);
  }

  async closeChannel(channelId: string): Promise<ChannelState> {
    const channelResult = await this.channelClient.closeChannel(channelId);
    this.cacheChannelState(convertToChannelState(channelResult));
    return convertToChannelState(channelResult);
  }

  async challengeChannel(channelId: string): Promise<ChannelState> {
    const channelResult = await this.channelClient.challengeChannel(channelId);
    this.cacheChannelState(convertToChannelState(channelResult));
    return convertToChannelState(channelResult);
  }

  async updateChannel(
    channelId: string,
    beneficiary: string,
    payer: string,
    beneficiaryBalance: string,
    payerBalance: string,
    beneficiaryOutcomeAddress: string,
    payerOutcomeAddress: string
  ): Promise<ChannelState> {
    const allocations = formatAllocations(
      beneficiaryOutcomeAddress,
      payerOutcomeAddress,
      beneficiaryBalance,
      payerBalance
    );
    const participants = formatParticipants(
      beneficiary,
      payer,
      beneficiaryOutcomeAddress,
      payerOutcomeAddress
    );

    const channelResult = await this.channelClient.updateChannel(
      channelId,
      participants,
      allocations,
      'appData unused'
    );
    this.cacheChannelState(convertToChannelState(channelResult));
    return convertToChannelState(channelResult);
  }

  // payer may use this method to make payments (if they have sufficient funds)
  async makePayment(channelId: string, amount: string) {
    const {
      beneficiary,
      payer,
      beneficiaryBalance,
      payerBalance,
      beneficiaryOutcomeAddress,
      payerOutcomeAddress
    } = this.channelCache[channelId];
    if (bigNumberify(payerBalance).gte(amount)) {
      await this.updateChannel(
        channelId,
        beneficiary,
        payer,
        bigNumberify(beneficiaryBalance)
          .add(amount)
          .toString(),
        bigNumberify(payerBalance)
          .sub(amount)
          .toString(),
        beneficiaryOutcomeAddress,
        payerOutcomeAddress
      );
    }
  }
  // beneficiary may use this method to accept payments
  async acceptPayment(channelState: ChannelState) {
    const {
      channelId,
      beneficiary,
      payer,
      beneficiaryBalance,
      payerBalance,
      beneficiaryOutcomeAddress,
      payerOutcomeAddress
    } = channelState;
    await this.updateChannel(
      channelId,
      beneficiary,
      payer,
      beneficiaryBalance,
      payerBalance,
      beneficiaryOutcomeAddress,
      payerOutcomeAddress
    );
  }

  amProposer(channelId: string): boolean {
    return this.channelCache[channelId].beneficiary === this.mySigningAddress;
  }
  isPaymentToMe(channelState: ChannelState): boolean {
    const turnNum = Number(channelState.turnNum);
    // doesn't guarantee that my balance increased
    if (channelState.beneficiary === this.mySigningAddress) {
      // returns true for the second postFS if I am the beneficiary
      // (I need to accept this 'payment' in order for another one to be sent)
      return (channelState.status === 'running' && turnNum % 2 === 1) || turnNum === 3;
    }
    throw new Error(`${this.mySigningAddress} is not the beneficiary ${channelState.beneficiary}`);
  }

  async pushMessage(message: Message<ChannelResult>) {
    await this.channelClient.pushMessage(message);
    const channelResult: ChannelResult = message.data;
    this.cacheChannelState(convertToChannelState(channelResult));
  }

  async approveBudgetAndFund(
    playerAmount: string,
    hubAmount: string,
    playerDestinationAddress: string,
    hubAddress: string,
    hubDestinationAddress: string
  ) {
    await this.channelClient.approveBudgetAndFund(
      playerAmount,
      hubAmount,
      playerDestinationAddress,
      hubAddress,
      hubDestinationAddress
    );
  }

  async getBudget(hubAddress: string): Promise<SiteBudget> {
    return await this.channelClient.getBudget(hubAddress);
  }

  async closeAndWithdraw(hubAddress: string): Promise<SiteBudget> {
    return await this.channelClient.closeAndWithdraw(hubAddress);
  }
}

export const paymentChannelClient = new PaymentChannelClient(
  new ChannelClient(window.channelProvider)
);

export const ChannelContext = React.createContext(paymentChannelClient);

const convertToChannelState = (channelResult: ChannelResult): ChannelState => {
  const {
    turnNum,
    channelId,
    participants,
    allocations,
    challengeExpirationTime,
    status
  } = channelResult;
  return {
    channelId,
    turnNum: turnNum.toString(), // TODO: turnNum should be switched to a number (or be a string everywhere),
    status,
    challengeExpirationTime,
    beneficiary: participants[0].participantId,
    payer: participants[1].participantId,
    beneficiaryOutcomeAddress: participants[0].destination,
    payerOutcomeAddress: participants[1].destination,
    beneficiaryBalance: bigNumberify(allocations[0].allocationItems[0].amount).toString(),
    payerBalance: bigNumberify(allocations[0].allocationItems[1].amount).toString()
  };
};

const formatParticipants = (
  aAddress: string,
  bAddress: string,
  aOutcomeAddress: string = aAddress,
  bOutcomeAddress: string = bAddress
) => [
  {participantId: aAddress, signingAddress: aAddress, destination: aOutcomeAddress},
  {participantId: bAddress, signingAddress: bAddress, destination: bOutcomeAddress}
];

const formatAllocations = (aAddress: string, bAddress: string, aBal: string, bBal: string) => {
  return [
    {
      token: '0x0',
      allocationItems: [
        {destination: aAddress, amount: bigNumberify(aBal).toHexString()},
        {destination: bAddress, amount: bigNumberify(bBal).toHexString()}
      ]
    }
  ];
};