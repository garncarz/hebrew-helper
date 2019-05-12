import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Quiz, QuizItem, QuizTable } from './Quiz.js';
import { VERSION, checkVersion } from './version.js';

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

    this.importFileInput = React.createRef();
  }

  onDelete(index) {
    if (window.confirm('Really delete ' + this.state.data[index] + '?')) {
      this.setState(state => {
        state.data.splice(index, 1);
        this.props.cookies.set('vocabulary', state.data);
        return state;
      });
    }
  }

  onNewWordChange = (event) => {
    event.persist();
    this.setState(state => {
      state.newWord[event.target.name] = event.target.value;
      return state;
    });
    // TODO don't lose input focus
  }

  onAdd = () => {
    this.setState(state => {
      // TODO state.data should also be a dict
      state.data.push([state.newWord['eng'], state.newWord['he'], state.newWord['tr']]);
      this.props.cookies.set('vocabulary', state.data);
      state.newWord = {};
      return state;
    });
  }

  exportData = () => {
    // https://stackoverflow.com/a/33542499
    var filename = 'vocabulary.json';
    var blob = new Blob([JSON.stringify({version: VERSION, data: this.state.data})], {type: 'application/json'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }

  importData = (event) => {
    event.preventDefault();

    // maybe do some merging?
    if (!window.confirm('Really remove existing vocabulary and import it from file?')) {
      return;
    }

    var file = this.importFileInput.current.files[0];
    var reader = new FileReader();

    reader.onloadend = () => {
      var blob = reader.result;
      var json = JSON.parse(blob);
      checkVersion(json.version);

      this.setState(state => {
        state.data = json.data;
        this.props.cookies.set('vocabulary', state.data);
        return state;
      });
    };

    reader.readAsText(file);

    this.importFileInput.current.value = null;
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
                            onClick={ e => this.onAdd() }>Add</button>
                  </div>
                );
              },
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />

        <button onClick={ this.exportData }>Export</button><br />

        <form onSubmit={ this.importData }>
          <input type="file" ref={ this.importFileInput } />
          <button type="submit">Import</button>
        </form>

      </div>
    );
  }

}
