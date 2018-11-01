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
      return this.fem_he + ' (' + this.fem_tr + ')';
    } else {
      return this.masc_he + ' (' + this.masc_tr + ')';
    }
  }

  checkAnswer(answer) {
    this.ok = false;
    if (!answer) {
      return false;
    }
    if (!this.from_eng) {
      this.ok = answer === this.nr.toString();
      return this.ok;
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
    if (!this.from_eng) {
      return this.ok ? '' : this.nr.toString();
    }

    var help = this.fem_he + ' (' + this.fem_tr + ')';
    if (this.masc_he !== '') {
      help += '<br/>' + this.masc_he + ' (' + this.masc_tr + ')';
    }
    return help;
  }

}


export class Numerals {

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
    this.showHelp = this.showHelp.bind(this);

    this.questionRef = React.createRef();
    this.inputRef = React.createRef();
    this.showHelpRef = React.createRef();
    this.nextRef = React.createRef();
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

    this.showHelpRef.current.style.display = 'block';
    this.nextRef.current.style.display = 'none';

    this.inputRef.current.focus();
  }

  checkAnswer(event) {
    var answer = this.inputRef.current.value.trim();
    var ok = this.numerals.numeral.checkAnswer(answer);

    var msg = ok ? '✓' : 'No...';
    var help = this.numerals.numeral.getHelp();

    if (help) {
      msg += '<br/>' + help;
    }

    if (!ok && event.target === this.inputRef.current) {
      msg = '';
    }

    this.helpRef.current.innerHTML = msg;

    if (ok) {
      this.showHelpRef.current.style.display = 'none';
      this.nextRef.current.style.display = 'block';
    }
  }

  showHelp() {
    var help = this.numerals.numeral.getHelp();
    this.helpRef.current.innerHTML = help;

    this.inputRef.current.focus();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p ref={this.questionRef}></p>
          <input type="text" ref={this.inputRef} onChange={this.checkAnswer}></input>
          <input type="button" ref={this.showHelpRef} onClick={this.showHelp} value="Help"></input>
          <input type="button" ref={this.nextRef} onClick={this.newQuestion} value="Next"></input>
          <p ref={this.helpRef} className="help"></p>
        </header>
      </div>
    );
  }

}

export default App;
