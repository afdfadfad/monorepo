// generated by logging the messages to the console while playing rps
export const getWalletInformation = {
  jsonrpc: '2.0',
  id: 158199348833,
  method: 'GetWalletInformation',
  params: {}
};
export const enableEthereum = {
  jsonrpc: '2.0',
  id: 1581594323639,
  method: 'EnableEthereum',
  params: {}
};
export const pushMessage = {
  jsonrpc: '2.0',
  id: 1581594379485,
  method: 'PushMessage',
  params: {
    data: {
      participants: [
        {
          destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
          participantId: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
          signingAddress: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0'
        },
        {
          destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
          participantId: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0',
          signingAddress: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0'
        }
      ],
      signedState: {
        signature: {
          r: '0x733ccfc3b0b13b446de290a9b056a5b9d7eb1538c1d48f8b863f731a0ea522c4',
          recoveryParam: 1,
          s: '0x6ad30427d0859d782c98ccdc5fe10fc9c3d6480ee5080f70fd96128e4d61d507',
          v: 28
        },
        state: {
          appData:
            '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004444444444444444444444444444444444444444444444444444444444444444',
          appDefinition: '0x430869383d611bBB1ce7Ca207024E7901bC26b40',
          challengeDuration: 300,
          channel: {
            chainId: '0x2329',
            channelNonce: '0x11b1a311d845ca99f8e3c9a5f828f574b1afe2c3a0eb8cd51115dff18f0f34a0',
            participants: [
              '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
              '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0'
            ]
          },
          isFinal: false,
          outcome: [
            {
              allocationItems: [
                {
                  amount: '0x06f05b59d3b20000',
                  destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                },
                {
                  amount: '0x06f05b59d3b20000',
                  destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                }
              ],
              assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57'
            }
          ],
          turnNum: 0
        }
      },
      type: 'Channel.Open'
    },
    recipient: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0',
    sender: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0'
  }
};
export const createChannel = {
  jsonrpc: '2.0',
  id: 1581594378830,
  method: 'CreateChannel',
  params: {
    participants: [
      {
        participantId: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
        signingAddress: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
        destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
      },
      {
        participantId: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0',
        signingAddress: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0',
        destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
      }
    ],
    allocations: [
      {
        token: '0x0',
        allocationItems: [
          {
            destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
            amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000'
          },
          {
            destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
            amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000'
          }
        ]
      }
    ],
    appDefinition: '0x430869383d611bBB1ce7Ca207024E7901bC26b40',
    appData:
      '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004444444444444444444444444444444444444444444444444444444444444444'
  }
};
export const pushMessage2 = {
  jsonrpc: '2.0',
  id: 1581594380282,
  method: 'PushMessage',
  params: {
    data: {
      participants: [
        {
          destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
          participantId: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
          signingAddress: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0'
        },
        {
          destination: '0x63e3fb11830c01ac7c9c64091c14bb6cbaac9ac7',
          participantId: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0',
          signingAddress: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0'
        }
      ],
      signedState: {
        signature: {
          r: '0x6bc9f3577996911ad27e3737d9bf81244d68b24b4eb5f937430834318ec0dbe2',
          recoveryParam: 1,
          s: '0x1d10beffaa366700bd77ce448702be91c2c6594cdbdbff81294f7eb1c0a4083e',
          v: 28
        },
        state: {
          appData:
            '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004444444444444444444444444444444444444444444444444444444444444444',
          appDefinition: '0x430869383d611bBB1ce7Ca207024E7901bC26b40',
          challengeDuration: 300,
          channel: {
            chainId: '0x2329',
            channelNonce: '0x11b1a311d845ca99f8e3c9a5f828f574b1afe2c3a0eb8cd51115dff18f0f34a0',
            participants: [
              '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
              '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0'
            ]
          },
          isFinal: false,
          outcome: [
            {
              allocationItems: [
                {
                  amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000',
                  destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                },
                {
                  amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000',
                  destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                }
              ],
              assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57'
            }
          ],
          turnNum: 1
        }
      },
      type: 'Channel.Joined'
    },
    recipient: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
    sender: '0x590A3Bd8D4A3b78411B3bDFb481E44e85C7345c0'
  }
};

export const closeChannel = {
  jsonrpc: '2.0',
  id: 1581594323759,
  method: 'CloseChannel',
  params: {
    channelId: '0x697ecf681033a2514ed19c90299a67ae8677f3c78b5877fe4550c4f0960e87b7'
  }
};
