import { Quiz, QuizItem } from './Quiz.js';
import { numerals } from './db.js';
import './NumeralsQuiz.css';


class Numeral extends QuizItem {

  constructor(nr, fem_tr, fem_he, masc_tr='', masc_he='') {
    super();

    this.nr = nr;
    this.fem_tr = fem_tr;
    this.fem_he = fem_he;
    this.masc_tr = masc_tr;
    this.masc_he = masc_he;
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
    if (this.fem_tr === answer || this.fem_tr.replace("'", '') === answer
        || this.fem_he === answer || this.removeNiqqud(this.fem_he) === answer) {
      this.ok = 'fem';
    }
    if (this.masc_tr === answer || this.masc_tr.replace("'", '') === answer
        || this.masc_he === answer || this.removeNiqqud(this.masc_he) === answer) {
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


export default class NumeralsQuiz extends Quiz {

  constructor(props) {
    super(props);

    for (var i = 0; i < numerals.length; i++) {
      this.items.push(new Numeral(...numerals[i]));
    }
  }

}
