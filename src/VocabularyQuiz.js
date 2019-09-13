import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { blob2text } from './lib';
import { Quiz, QuizItem, QuizTable } from './Quiz.js';
import { VERSION, checkVersion } from './version.js';


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
    else if (this.tr && (this.tr === answer || this.tr.replace("'", '') === answer)) {
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

    var vocabulary = props.cookies.get('vocabulary') || [];

    for (var i = 0; i < vocabulary.length; i++) {
      this.items.push(new VocabularyItem(...vocabulary[i]));
    }
  }

}


export class VocabularyTable extends QuizTable {

  constructor(props) {
    super(props);

    this.state = {
      data: props.cookies.get('vocabulary') || [],
      newWord: {},
    };

    this.newWordInputs = {
      eng: React.createRef(),
      he: React.createRef(),
      tr: React.createRef(),
    };
  }

  afterStateSet = () => {
    this.props.cookies.set('vocabulary', this.state.data);
  }

  onDelete(index) {
    if (window.confirm('Really delete ' + this.state.data[index] + '?')) {
      this.setState(state => {
        state.data.splice(index, 1);
        return state;
      }, this.afterStateSet);
    }
  }

  onNewWordChange = (event) => {
    event.persist();
    this.setState(state => {
      state.newWord[event.target.name] = event.target.value;
      return state;
    }, () => { this.newWordInputs[event.target.name].current.focus(); });
  }

  onAdd = () => {
    this.setState(state => {
      // TODO state.data should also be a dict
      state.data.push([state.newWord['eng'], state.newWord['he'], state.newWord['tr']]);
      state.newWord = {};
      return state;
    }, this.afterStateSet);
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
              Cell: this.renderEditable,
              Footer: () => {
                return (
                  <div>
                    <input type="text" name="eng" placeholder="New word (English)"
                           ref={ this.newWordInputs['eng'] }
                           value={ this.state.newWord['eng'] } onChange={ this.onNewWordChange } />
                  </div>
                );
              },
            },
            {
              Header: "Hebrew",
              id: 1,
              Cell: this.renderEditable,
              Footer: () => {
                return (
                  <div>
                    <input type="text" name="he" placeholder="New word (Hebrew)"
                           ref={ this.newWordInputs['he'] }
                           value={ this.state.newWord['he'] } onChange={ this.onNewWordChange } />
                  </div>
                );
              },
            },
            {
              Header: "Transcript",
              id: 2,
              Cell: this.renderEditable,
              Footer: () => {
                return (
                  <div>
                    <input type="text" name="tr" placeholder="New word (transcript)"
                           ref={ this.newWordInputs['tr'] }
                           value={ this.state.newWord['tr'] } onChange={ this.onNewWordChange } />
                  </div>
                );
              },
            },
            {
              Cell: (cellInfo) => {
                return (
                  <div>
                    <button onClick={ e => this.onDelete(cellInfo.index) }>Delete</button>
                  </div>
                );
              },
              Footer: () => {
                return (
                  <div>
                    <button disabled={ !(this.state.newWord['eng'] && this.state.newWord['he']) }
                            name="addBtn" onClick={ this.onAdd }>Add</button>
                  </div>
                );
              },
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />

        { this.state.data.length < 1 &&
          <p>You can get some vocabulary at: TODO</p>
        }

      </div>
    );
  }

}
