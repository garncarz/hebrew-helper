import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import NumeralsQuiz from './NumeralsQuiz';
import * as serviceWorker from './serviceWorker';

ReactGA.initialize('UA-128507110-1');

ReactDOM.render(<NumeralsQuiz />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
