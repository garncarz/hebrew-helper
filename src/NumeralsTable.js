import React from 'react';

import Table from 'react-bootstrap/Table';

import { numerals } from './db.js';


export default class NumeralsTable extends React.Component {

  render() {
    return (
      <div className="content">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Number</th>
              <th>Feminine</th>
              <th>Masculine</th>
            </tr>
          </thead>
          <tbody>
            { numerals.map((numeral, i) =>
              <tr key={ i }>
                <td>{numeral[0]}</td>
                { numeral.length > 3 &&
                  <>
                    <td>{numeral[2]} ({numeral[1]})</td>
                    <td>{numeral[4]} ({numeral[3]})</td>
                  </>
                }
                { numeral.length <= 3 &&
                  <td colSpan="2" className="text-center">{numeral[2]} ({numeral[1]})</td>
                }
              </tr>
            ) }
          </tbody>
        </Table>
      </div>
    );
  }

}
