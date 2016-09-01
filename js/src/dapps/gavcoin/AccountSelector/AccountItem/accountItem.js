import React, { Component, PropTypes } from 'react';

import styles from './style.css';

const { IdentityIcon } = window.parity.react;

export default class AccountItem extends Component {
  static propTypes = {
    account: PropTypes.object,
    gavBalance: PropTypes.bool
  };

  render () {
    const { account, gavBalance } = this.props;

    const balance = gavBalance
      ? (account.gavBalance ? `${account.gavBalance}GAV` : '')
      : (account.ethBalance ? `${account.ethBalance}ΞTH` : '');

    return (
      <div className={ styles.account }>
        <div className={ styles.image }>
          <IdentityIcon
            inline center
            address={ account.address } />
        </div>
        <div className={ styles.details }>
          <div className={ styles.name }>
            { account.name || account.address }
          </div>
          <div className={ styles.balance }>
            { balance }
          </div>
        </div>
      </div>
    );
  }
}