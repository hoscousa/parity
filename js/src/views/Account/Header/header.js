// Copyright 2015, 2016 Ethcore (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component, PropTypes } from 'react';

import { Balance, Container, ContainerTitle, IdentityIcon, IdentityName } from '../../../ui';

import styles from './header.css';

export default class Header extends Component {
  static contextTypes = {
    api: PropTypes.object
  }

  static propTypes = {
    account: PropTypes.object,
    balance: PropTypes.object,
    isTest: PropTypes.bool
  }

  state = {
    name: null
  }

  componentWillMount () {
    this.setName();
  }

  componentWillReceiveProps () {
    this.setName();
  }

  render () {
    const { account, balance } = this.props;
    const { address, meta, uuid } = account;

    if (!account) {
      return null;
    }

    const uuidText = !uuid
      ? null
      : <div className={ styles.uuidline }>uuid: { uuid }</div>;

    return (
      <Container>
        <IdentityIcon
          address={ address } />
        <div className={ styles.floatleft }>
          <ContainerTitle title={ <IdentityName address={ address } unknown /> } />
          <div className={ styles.addressline }>
            { address }
          </div>
          { uuidText }
          <div className={ styles.infoline }>
            { meta.description }
          </div>
          { this.renderTxCount() }
        </div>
        <div className={ styles.balances }>
          <Balance
            account={ account }
            balance={ balance } />
        </div>
      </Container>
    );
  }

  renderTxCount () {
    const { isTest, balance } = this.props;

    if (!balance) {
      return null;
    }

    const txCount = balance.txCount.sub(isTest ? 0x100000 : 0);

    return (
      <div className={ styles.infoline }>
        { txCount.toFormat() } outgoing transactions
      </div>
    );
  }

  onSubmitName = (name) => {
    const { api } = this.context;
    const { account } = this.props;

    this.setState({ name }, () => {
      api.personal
        .setAccountName(account.address, name)
        .catch((error) => {
          console.error(error);
        });
    });
  }

  setName () {
    const { account } = this.props;

    if (account && account.name !== this.propName) {
      this.propName = account.name;
      this.setState({
        name: account.name
      });
    }
  }
}
