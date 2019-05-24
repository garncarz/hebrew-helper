import React from 'react';

import { us2heKeys } from './lib';

const usLayout = [
  'wertyuiop',
  'asdfghjkl;',
  'zxcvbnm,.',
];


class Key extends React.Component {

  onClick = () => {
    this.props.addChar(this.props.eng);
  }

  render() {
    const he = us2heKeys[this.props.eng.toLowerCase()];
    const eng = this.props.eng.toUpperCase();

    return (
      <svg onClick={ this.onClick }>
        <rect width="10" height="10" rx="1" ry="1" fill="grey" x="0" y="0" />
        <rect width="9" height="9" rx="1" ry="1" fill="white" x="0.5" y="0.5" />
        <text fontSize="5" fill="black" x={ ![',', '.'].includes(eng) ? 1.4 : 3 } y="5">
          { eng }
        </text>
        <text fontSize="5" fill="blue" x={ eng !== 'W' ? 5 : 7 } y="8.5">
          { he }
        </text>
      </svg>
    );
  }

}


class Row extends React.Component {

  render() {
    return (
      <svg>
        { this.props.keys.split('').map((key, column) =>
          <svg key={ column } x={ 11 * column }>
            <Key eng={ key } addChar={ this.props.addChar } />
          </svg>
        ) }
      </svg>
    )
  }

}


export default class UsHeKeyboard extends React.Component {

  render() {
    return (
      <svg viewBox="0 0 110 35">
        <svg x="9" y="0"><Row keys={ usLayout[0] } addChar={ this.props.addChar } /></svg>
        <svg x="0" y="11"><Row keys={ usLayout[1] } addChar={ this.props.addChar } /></svg>
        <svg x="6" y="22"><Row keys={ usLayout[2] } addChar={ this.props.addChar } /></svg>
      </svg>
    );
  }

}
