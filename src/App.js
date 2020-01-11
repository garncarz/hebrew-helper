import React from 'react';
import { CookiesProvider, withCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';

import NumeralsQuiz from './NumeralsQuiz';
import NumeralsTable from './NumeralsTable';
import { VocabularyQuiz, VocabularyTable } from './VocabularyQuiz';
import Settings from './Settings';

import DavidStar from './david_star.svg';


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
          <Container>
            <Row>
              <Header />
            </Row>

            <Row>
              <Col>
                <Route exact path="/" render={ () => <Redirect to="/numeralsQuiz" /> } />
                <Route path="/numeralsQuiz" component={ NumeralsQuiz } />
                <Route path="/numeralsTable" component={ NumeralsTable } />
                <Route path="/vocabularyQuiz" component={ withCookies(VocabularyQuiz) } />
                <Route path="/vocabularyTable" component={ withCookies(VocabularyTable) } />
                <Route path="/settings" component={ withCookies(Settings) } />
              </Col>
            </Row>
          </Container>
        </Router>
      </CookiesProvider>
    );
  }

}


const Header = () => (
  <Navbar expand="lg">
    <Navbar.Brand>
      <img alt="" src={ DavidStar } width="30" height="30" />
      {' Hebrew Learning Helper'}
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav fill variant="tabs">
        <LinkContainer to="/numeralsQuiz"><Nav.Link>Numerals quiz</Nav.Link></LinkContainer>
        <LinkContainer to="/numeralsTable"><Nav.Link>Numerals table</Nav.Link></LinkContainer>
        <LinkContainer to="/vocabularyQuiz"><Nav.Link>Vocabulary quiz</Nav.Link></LinkContainer>
        <LinkContainer to="/vocabularyTable"><Nav.Link>Vocabulary table</Nav.Link></LinkContainer>
        <LinkContainer to="/settings"><Nav.Link>Settings</Nav.Link></LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
