import React from 'react';
import { CookiesProvider, withCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

import NumeralsQuiz from './NumeralsQuiz';
import NumeralsTable from './NumeralsTable';
import { VocabularyQuiz, VocabularyTable } from './VocabularyQuiz';

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
      <CookiesProvider>
        <Router history={ history }>
          <div>
            <Header />

            <Route exact path="/" render={ () => <Redirect to="/numeralsQuiz" /> } />
            <Route path="/numeralsQuiz" component={ NumeralsQuiz } />
            <Route path="/numeralsTable" component={ NumeralsTable } />
            <Route path="/vocabularyQuiz" component={ withCookies(VocabularyQuiz) } />
            <Route path="/vocabularyTable" component={ withCookies(VocabularyTable) } />
          </div>
        </Router>
      </CookiesProvider>
    );
  }

}


const Header = () => (
  <div className="header">
    <Link to="/numeralsQuiz">Numerals quiz</Link>
    <Link to="/numeralsTable">Numerals table</Link>
    <Link to="/vocabularyQuiz">Vocabulary quiz</Link>
    <Link to="/vocabularyTable">Vocabulary table</Link>
  </div>
);
