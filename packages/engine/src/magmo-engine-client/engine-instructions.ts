import {State} from "@statechannels/nitro-protocol";
import {Signature} from "ethers/utils";

export enum PlayerIndex {
  "A" = 0,
  "B" = 1
}

export const INITIALIZE_REQUEST = "ENGINE.INITIALIZE_REQUEST";
export const initializeRequest = userId => ({
  type: INITIALIZE_REQUEST as typeof INITIALIZE_REQUEST,
  userId
});
export type InitializeRequest = ReturnType<typeof initializeRequest>;

// FUNDING
// =======

// TODO: after the refactor we should already have all these details. At most this request
// would need the channelId (and we don't even need that while we do one channel per engine)
export const FUNDING_REQUEST = "ENGINE.FUNDING.REQUEST";
export const fundingRequest = (
  channelId: string,
  myAddress: string,
  opponentAddress: string,
  myBalance: string,
  opponentBalance: string,
  playerIndex: PlayerIndex
) => ({
  type: FUNDING_REQUEST as typeof FUNDING_REQUEST,
  channelId,
  myAddress,
  opponentAddress,
  myBalance,
  opponentBalance,
  playerIndex
});
export type FundingRequest = ReturnType<typeof fundingRequest>;

// VALIDATION
// ==========

// Called when a signed position is received from an opponent.
export const VALIDATE_STATE_REQUEST = "ENGINE.VALIDATION.REQUEST";
export const validateStateRequest = (state: State, signature: Signature) => ({
  type: VALIDATE_STATE_REQUEST as typeof VALIDATE_STATE_REQUEST,
  state,
  signature
});
export type ValidateStateRequest = ReturnType<typeof validateStateRequest>;

// SIGNATURE
// =========

// Called to obtain a signature on a state before sending to an opponent.
export const SIGN_STATE_REQUEST = "ENGINE.SIGNATURE.REQUEST";
export const signStateRequest = (state: any) => ({
  type: SIGN_STATE_REQUEST as typeof SIGN_STATE_REQUEST,
  state
});
export type SignStateRequest = ReturnType<typeof signStateRequest>;

// WITHDRAWAL
// ==========

export const WITHDRAWAL_REQUEST = "ENGINE.WITHDRAWAL.REQUEST";
export const withdrawalRequest = (state: State) => ({
  type: WITHDRAWAL_REQUEST as typeof WITHDRAWAL_REQUEST,
  state
});
export type WithdrawalRequest = ReturnType<typeof withdrawalRequest>;

// Challenge
// =========

export const CREATE_CHALLENGE_REQUEST = "ENGINE.CHALLENGE.CREATE";
export const createChallenge = (channelId: string) => ({
  type: CREATE_CHALLENGE_REQUEST as typeof CREATE_CHALLENGE_REQUEST,
  channelId
});
export type CreateChallengeRequest = ReturnType<typeof createChallenge>;

export const RESPOND_TO_CHALLENGE = "ENGINE.RESPOND_TO_CHALLENGE";
export const respondToChallenge = (state: State) => ({
  state,
  type: RESPOND_TO_CHALLENGE as typeof RESPOND_TO_CHALLENGE
});
export type RespondToChallenge = ReturnType<typeof respondToChallenge>;

export const CONCLUDE_CHANNEL_REQUEST = "ENGINE.CHANNEL.REQUEST.CONCLUDE";
export const concludeChannelRequest = (channelId: string) => ({
  channelId,
  type: CONCLUDE_CHANNEL_REQUEST as typeof CONCLUDE_CHANNEL_REQUEST
});
export type ConcludeChannelRequest = ReturnType<typeof concludeChannelRequest>;

// Engine-to-engine communication
// =========

// Called when a "engine message" is received from the opponent.
// By "engine message" we mean a message that was created directly from the opponent's
// engine meant for engine-to-engine communication (e.g. communicating the address of the
// adjudicator).
export const RECEIVE_MESSAGE = "ENGINE.MESSAGING.RECEIVE_MESSAGE";
export const receiveMessage = (messagePayload: any) => ({
  type: RECEIVE_MESSAGE,
  messagePayload
});
export type ReceiveMessage = ReturnType<typeof receiveMessage>;

// Requests
// ========
export type RequestAction =
  | ConcludeChannelRequest
  | FundingRequest
  | SignStateRequest
  | ValidateStateRequest
  | WithdrawalRequest
  | CreateChallengeRequest;
