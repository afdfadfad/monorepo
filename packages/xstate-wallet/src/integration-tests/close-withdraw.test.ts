import {FakeChain} from '../chain';
import {Player, hookUpMessaging, generateCloseAndWithdrawRequest} from './helpers';
import {CloseAndWithdrawResponse} from '@statechannels/client-api-schema';
import {filter, map, first} from 'rxjs/operators';
import waitForExpect from 'wait-for-expect';

jest.setTimeout(30000);

it('allows for a wallet to close the ledger channel with the hub and withdraw', async () => {
  const fakeChain = new FakeChain();

  const playerA = new Player(
    '0x275a2e2cd9314f53b42246694034a80119963097e3adf495fbf6d821dc8b6c8e',
    'PlayerA',
    fakeChain
  );

  const hub = new Player(
    '0x8624ebe7364bb776f891ca339f0aaa820cc64cc9fca6a28eec71e6d8fc950f29',
    'Hub',
    fakeChain
  );

  hookUpMessaging(playerA, hub);

  // TODO: Implement this for conclude objective
  // hub.store.newObjectiveFeed

  const closeAndWithdrawMessage = generateCloseAndWithdrawRequest(
    playerA.participant,
    hub.participant
  );
  const closeAndWithdrawPromise = playerA.messagingService.outboxFeed
    .pipe(
      filter(m => 'id' in m && m.id === closeAndWithdrawMessage.id),
      map(m => m as CloseAndWithdrawResponse),
      first()
    )
    .toPromise();
  await playerA.messagingService.receiveRequest(closeAndWithdrawMessage);
  await waitForExpect(async () => {
    expect(playerA.workflowState).toEqual('waitForUserApproval');
  }, 3000);

  playerA.channelWallet.workflows[0].machine.send({type: 'USER_APPROVES_CLOSE'});

  const closeAndWithdrawResponse: CloseAndWithdrawResponse = await closeAndWithdrawPromise;

  expect(closeAndWithdrawResponse).toBeDefined();
});
