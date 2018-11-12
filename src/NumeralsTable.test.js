import React from 'react';
import ReactDOM from 'react-dom';
import NumeralsTable from './NumeralsTable';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NumeralsTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
