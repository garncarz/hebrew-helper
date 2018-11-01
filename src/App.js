import React, { Component } from 'react';
import david_star from './david_star.svg';
import './App.css';


var numerals = [
  [0, 'efes', 'אֶפֶס'],
  [1, 'achat', 'אַחַת', 'echad', 'אֶחָד'],
  [2, 'shtayim', 'שְׁתַּיִם', 'shnayim', 'שְׁנַיִם'],
];


class Numeral {

  constructor(nr, fem_tr, fem_he, masc_tr='', masc_he='') {
    this.nr = nr;
    this.fem_tr = fem_tr;
    this.fem_he = fem_he;
    this.masc_tr = masc_tr;
    this.masc_he = masc_he;
  }

  newQuestion() {
    this.from_eng = Math.random() >= 0.5;
    this.ok = false;
  }

  getQuestion() {
    if (this.from_eng) {
      return this.nr;
    }
    if (Math.random() >= 0.5 || this.masc_he === '') {
      return this.fem_he + '(' + this.fem_tr + ')';
    } else {
      return this.masc_he + '(' + this.masc_tr + ')';
    }
  }

  checkAnswer(answer) {
    this.ok = false;
    if (!answer) {
      return false;
    }
    if (!this.from_eng) {
      return answer === this.nr.toString();
    }
    if (this.fem_tr === answer || this.fem_he === answer) {
      this.ok = 'fem';
    }
    if (this.masc_tr === answer || this.masc_he === answer) {
      this.ok = 'masc';
    }
    return this.ok;
  }

  getHelp() {
    if (this.ok === 'fem') {
      return this.fem_he + '(' + this.fem_tr + ')';
    }
    if (this.ok == 'masc') {
      return this.masc_he + '(' + this.masc_tr + ')';
    }
  }

}


class Numerals {

  constructor() {
    this.numerals = [];
    for (var i = 0; i < numerals.length; i++) {
      this.numerals.push(new Numeral(...numerals[i]));
    }
  }

  newQuestion() {
    this.numeral = this.numerals[Math.floor(Math.random() * this.numerals.length)];
    this.numeral.newQuestion();
  }

}


class App extends Component {

  constructor(props) {
    super(props);

    this.numerals = new Numerals();

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
    this.numerals.newQuestion();

    this.questionRef.current.innerHTML = this.numerals.numeral.getQuestion();
    this.inputRef.current.value = '';
    this.helpRef.current.innerHTML = '';
  }

  checkAnswer(event) {
    var answer = this.inputRef.current.value.trim();
    var ok = this.numerals.numeral.checkAnswer(answer);

    var msg = ok ? 'OK!' : 'No...';
    var help = this.numerals.numeral.getHelp();

    if (help) {
      msg += '<br/>' + help;
    }

    if (!ok && event.target === this.inputRef.current) {
      msg = '';
    }

    this.helpRef.current.innerHTML = msg;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={david_star} className="App-logo" alt="logo" />
          <p ref={this.questionRef}></p>
          <input type="text" ref={this.inputRef} onChange={this.checkAnswer}></input>
          <input type="button" onClick={this.checkAnswer} value="Check"></input>
          <input type="button" onClick={this.newQuestion} value="Next"></input>
          <p ref={this.helpRef}></p>
        </header>
      </div>
    );
  }

}

export default App;
