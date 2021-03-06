/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>
              <a href={this.docUrl('state-channels/overview')}>Docs</a>
            </h5>
            <a href={this.docUrl('dapp-devs/quick-start')}>Dapp Developers</a>
            <a href={this.docUrl('wallet-devs/quick-start')}>Wallet Developers</a>
            <a href={this.docUrl('contract-devs/quick-start')}>Protocol Developers</a>
          </div>
          <div>
            <h5>
              <a href={this.docUrl('api/contract-inheritance')}>API</a>
            </h5>
            <a href={this.docUrl('contract-api/natspec/NitroAdjudicator')}>Nitro Adjudicator</a>
            <a href={this.docUrl('contract-api/natspec/ETHAssetHolder')}>ETH Asset Holder</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href={'https://statechannels.org/'}>Project Homepage</a>
            <a href={'https://statechannels.discourse.group/'}>Forum</a>
            <a href={'https://blog.statechannels.org/'}>Blog</a>
          </div>
          <div>
            <h5>Code</h5>
            {/* <a href={`${this.props.config.baseUrl}blog`}>Blog</a> */}
            <a href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
            <a href="https://www.npmjs.com/package/@statechannels/nitro-protocol">npm</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
