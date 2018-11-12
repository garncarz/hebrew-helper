import React from 'react';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import NumeralsQuiz from './NumeralsQuiz';
import NumeralsTable from './NumeralsTable';

import './App.css';


const App = () => (
  <Router>
    <div>
      <Header />

      <Route exact path="/" render={ () => <Redirect to="/numeralsQuiz" /> } />
      <Route path="/numeralsQuiz" component={ NumeralsQuiz } />
      <Route path="/numeralsTable" component={ NumeralsTable } />
    </div>
  </Router>
);

const Header = () => (
  <div className="header">
    <Link to="/numeralsQuiz">Numerals quiz</Link>
    <Link to="/numeralsTable">Numerals table</Link>
  </div>
);

export default App;
