import React, { Component } from 'react';
import { numerals } from './db.js';


export default class NumeralsTable extends Component {

  rows = () => {
    var rows = [];
    for (var i = 0; i < numerals.length; i++) {
      rows.push(
        <tr>
          <td>{numerals[i][0]}</td>
          { numerals[i].length > 3 &&
            <td>{numerals[i][2]} ({numerals[i][1]})</td>
          }
          { numerals[i].length > 3 &&
            <td>{numerals[i][4]} ({numerals[i][3]})</td>
          }
          { numerals[i].length <= 3 &&
            <td colspan="2">{numerals[i][2]} ({numerals[i][1]})</td>
          }
        </tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <div className="content">
        <table>
          <tr>
            <th>Number</th>
            <th>Feminine</th>
            <th>Masculine</th>
          </tr>
          { this.rows() }
        </table>
      </div>
    );
  }

}
