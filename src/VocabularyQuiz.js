import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Quiz, QuizItem, QuizTable } from './Quiz.js';

import { vocabulary } from './db.local.js';

import './VocabularyQuiz.css';


class VocabularyItem extends QuizItem {

  constructor(eng, he, tr='') {
    super();

    this.eng = eng;
    this.he = he;
    this.tr = tr;
  }

  getQuestion() {
    if (this.from_eng) {
      return this.eng;
    }
    return this.he;
  }

  checkAnswer(answer) {
    this.ok = false;
    if (!answer) {
      return false;
    }
    if (!this.from_eng) {
      this.ok = answer === this.eng;
      return this.ok;
    }
    if (this.he === answer || this.removeNiqqud(this.he) === answer) {
      this.ok = 'he';
    }
    if (this.tr && this.tr === answer || this.tr.replace("'", '') === answer) {
      this.ok = 'tr';
    }
    return this.ok;
  }

  getHelp() {
    var help = this.from_eng ? this.he : this.eng;
    if (this.tr) {
      return help += ' (' + this.tr + ')';
    }
    return help;
  }

}


export class VocabularyQuiz extends Quiz {

  constructor(props) {
    super(props);

    for (var i = 0; i < vocabulary.length; i++) {
      this.items.push(new VocabularyItem(...vocabulary[i]));
    }
  }

}


export class VocabularyTable extends QuizTable {

  constructor() {
    super();

    this.state = {
      data: vocabulary,
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div className="VocabularyTable">
        <ReactTable
          data={data}
          columns={[
            {
              Header: "English",
              id: 0,
              Cell: this.renderEditable
            },
            {
              Header: "Hebrew",
              id: 1,
              Cell: this.renderEditable
            },
            {
              Header: "Transcript",
              id: 2,
              Cell: this.renderEditable
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }

}
