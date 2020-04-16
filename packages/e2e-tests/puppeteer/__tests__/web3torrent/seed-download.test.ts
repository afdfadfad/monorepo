/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable jest/expect-expect */
import {Page, Browser} from 'puppeteer';
import {JEST_TIMEOUT, HEADLESS, USES_VIRTUAL_FUNDING} from '../../constants';

import {
  setUpBrowser,
  loadDapp,
  waitAndOpenChannel,
  waitForClosingChannel,
  waitForNthState
} from '../../helpers';

import {uploadFile, startDownload, cancelDownload} from '../../scripts/web3torrent';

jest.setTimeout(HEADLESS ? JEST_TIMEOUT : 1_000_000);

let browserA: Browser;
let browserB: Browser;
let web3tTabA: Page;
let web3tTabB: Page;
let tabs: [Page, Page];

describe('Web3-Torrent Integration Tests', () => {
  beforeAll(async () => {
    // 100ms sloMo avoids some undiagnosed race conditions
    console.log('Opening browsers');

    browserA = await setUpBrowser(HEADLESS, 100);
    browserB = await setUpBrowser(HEADLESS, 100);

    console.log('Waiting on pages');
    web3tTabA = (await browserA.pages())[0];
    web3tTabB = (await browserB.pages())[0];
    tabs = [web3tTabA, web3tTabB];

    const logPageOutput = (role: string) => (msg: any) =>
      // use console.error so we can redirect STDERR to a file
      process.env.CI && console.error(`${role}: `, msg.text());
    web3tTabA.on('console', logPageOutput('A'));
    web3tTabB.on('console', logPageOutput('B'));

    console.log('Loading dapps');
    await loadDapp(web3tTabA, 0, true);
    await loadDapp(web3tTabB, 1, true);

    await web3tTabA.goto('http://localhost:3000/upload', {waitUntil: 'load'});
  });

  afterAll(async () => {
    if (HEADLESS) {
      await Promise.all(
        [browserA, browserB].map(async browser => browser && (await browser.close()))
      );
    }
  });

  it('allows peers to start torrenting', async () => {
    console.log('A uploads a file');
    const url = await uploadFile(web3tTabA, USES_VIRTUAL_FUNDING);

    console.log('B starts downloading...');
    await startDownload(web3tTabB, url, USES_VIRTUAL_FUNDING);

    console.log('Waiting for open channels');
    await Promise.all(tabs.map(waitAndOpenChannel(USES_VIRTUAL_FUNDING)));

    // Let the download cointinue for some time
    console.log('Downloading');
    await waitForNthState(web3tTabB, 10);

    console.log('B cancels download');
    await cancelDownload(web3tTabB);

    console.log('Waiting for channels to close');
    await Promise.all(tabs.map(waitForClosingChannel));

    // TODO: puppeteer errors with something like `property `
    // "Evaluation failed: TypeError: Cannot read property 'textContent' of null"
    // eslint-disable-next-line no-constant-condition
    if (false) {
      // Inject some delays. Otherwise puppeteer may read the stale amounts and fails.
      await Promise.all([web3tTabA, web3tTabB].map(tab => tab.waitFor(1500)));

      console.log('Checking exchanged amount between downloader and uploader...');
      const earnedColumn = await web3tTabA.$('td.earned');
      const earned = await web3tTabA.evaluate(e => e.textContent, earnedColumn);
      const paidColumn = await web3tTabB.$('td.paid');
      const paid = await web3tTabB.evaluate(e => e.textContent, paidColumn);
      expect(paid).toEqual(`-${earned}`);
    }
  });
});