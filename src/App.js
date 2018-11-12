import React from 'react';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

import NumeralsQuiz from './NumeralsQuiz';
import NumeralsTable from './NumeralsTable';

import './App.css';


const history = createHistory();

history.listen(location => {
  ReactGA.set({ page: location.href });
  ReactGA.pageview(location.href);
});


export default class App extends React.Component {

  componentDidMount() {
    ReactGA.pageview(window.location.href);
  }

  render() {
    return (
      <Router history={ history }>
        <div>
          <Header />

          <Route exact path="/" render={ () => <Redirect to="/numeralsQuiz" /> } />
          <Route path="/numeralsQuiz" component={ NumeralsQuiz } />
          <Route path="/numeralsTable" component={ NumeralsTable } />
        </div>
      </Router>
    );
  }

}


const Header = () => (
  <div className="header">
    <Link to="/numeralsQuiz">Numerals quiz</Link>
    <Link to="/numeralsTable">Numerals table</Link>
  </div>
);
