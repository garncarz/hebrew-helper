import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


var numerals = [
  [0, 'efes', 'אֶפֶס'],
  [1, 'achat', 'אַחַת', 'echad', 'אֶחָד'],
  [2, 'shtayim', 'שְׁתַּיִם', 'shnayim', 'שְׁנַיִם'],
];


class App extends Component {

  constructor(props) {
    super(props);

    this.newQuestion = this.newQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);

    this.questionRef = React.createRef();
    this.inputRef = React.createRef();
    this.helpRef = React.createRef();
  }

  componentDidMount() {
    this.newQuestion();
  }

  newQuestion() {
    this.numeral = numerals[Math.floor(Math.random() * numerals.length)];
    this.question = Math.floor(Math.random() * this.numeral.length);

    this.questionRef.current.innerHTML = this.numeral[this.question];
    this.inputRef.current.value = '';
    this.helpRef.current.innerHTML = '';
  }

  checkAnswer() {
    var answer = this.inputRef.current.value.trim();
    var ok, msg;

    if (this.question === 0) {
      ok = this.numeral.indexOf(answer) > 0;
    } else {
      ok = this.numeral[0].toString() === answer;
    }

    if (ok) {
      msg = 'OK!';
    } else {
      msg = 'No...';
    }

    this.helpRef.current.innerHTML = msg;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p ref={this.questionRef}></p>
          <input type="text" ref={this.inputRef}></input>
          <input type="button" onClick={this.checkAnswer} value="Check"></input>
          <input type="button" onClick={this.newQuestion} value="Next"></input>
          <p ref={this.helpRef}></p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

}

export default App;
