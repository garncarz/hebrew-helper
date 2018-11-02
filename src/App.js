import React, { Component } from 'react';
import ReactGA from 'react-ga';
import './App.css';


var numerals = [
  [0, 'efes', 'אֶפֶס'],
  [1, 'achat', 'אַחַת', 'echad', 'אֶחָד'],
  [2, 'shtayim', 'שְׁתַּיִם', 'shnayim', 'שְׁנַיִם'],
  [3, 'shalosh', 'שָׁלֹשׁ', 'shlosha', 'שְׁלֹשָׁה'],
  [4, 'arba\'', 'אַרְבַּע', 'arba\'a', 'אַרְבָּעָה'],
  [5, 'chamesh', 'חָמֵשׁ', 'chamisha', 'חֲמִשָּׁה'],
  [6, 'shesh', 'שֵׁשׁ', 'shisha', 'שִׁשָּׁה'],
  [7, 'sheva\'', 'שֶׁבַע', 'shiv\'a', 'שִׁבְעָה'],
  [8, 'shmone', 'שְׁמוֹנֶה', 'shmona', 'שְׁמוֹנָה'],
  [9, 'tesha\'', 'תֵּשַׁע', 'tish\'a', 'תִּשְׁעָה'],
  [10, '\'eser', 'עֶשֶׂר', '\'assara', 'עֲשָׂרָה'],
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

    return this.getQuestion();
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
    if (this.fem_tr === answer || this.fem_he === answer || this.fem_tr.replace("'", '') === answer) {
      this.ok = 'fem';
    }
    if (this.masc_tr === answer || this.masc_he === answer || this.masc_tr.replace("'", '') === answer) {
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
      help += '\n' + this.masc_he + ' (' + this.masc_tr + ')';
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
    return this.numeral.newQuestion();
  }

}


class App extends Component {

  constructor(props) {
    super(props);

    this.numerals = new Numerals();

    this.state = {
      ok: false,
      question: '',
      answer: '',
      help: '',
    };

    this.newQuestion = this.newQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.keyPress = this.keyPress.bind(this);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.newQuestion();
  }

  newQuestion() {
    this.setState({
      ok: false,
      question: this.numerals.newQuestion(),
      answer: '',
      help: '',
    });

    this.inputRef.current.focus();
  }

  checkAnswer(event) {
    var answer = event.target.value.trim();
    var ok = this.numerals.numeral.checkAnswer(answer);

    this.setState({
      ok: ok,
      answer: answer,
      help: ok ? '✓\n' + this.numerals.numeral.getHelp() : '',
    });
  }

  showHelp() {
    this.setState({
      help: this.numerals.numeral.getHelp(),
    });

    this.inputRef.current.focus();
  }

  keyPress(event) {
    if (event.key === 'Enter' && this.state.ok) {
      this.newQuestion();
    }
  }

  render() {
    ReactGA.pageview('/numerals');
    return (
      <div className="App">
        <header className="App-header">
          <p>{ this.state.question }</p>
          <input type="text" ref={this.inputRef} onChange={this.checkAnswer}
            onKeyPress={this.keyPress} value={this.state.answer} />
          { this.state.ok
            ? <input type="button" onClick={this.newQuestion} value="Next" />
            : <input type="button" onClick={this.showHelp} value="Help" />
          }
          <p className="help">{ this.state.help }</p>
        </header>
      </div>
    );
  }

}

export default App;
