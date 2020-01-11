import React from 'react';

import { blob2text } from './lib';
import { VERSION, checkVersion } from './version';


export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.importFileInput = React.createRef();
  }

  exportData = () => {
    // https://stackoverflow.com/a/33542499
    var filename = 'hebrew-helper.json';
    var blob = new Blob(
      [ JSON.stringify({ version: VERSION, vocabulary: this.props.cookies.get('vocabulary') || [] }) ],
      { type: 'application/json' },
    );
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

  importData = async (event) => {
    event.preventDefault();

    // maybe do some merging?
    if (!window.confirm('Really remove existing vocabulary and import it from file?')) {
      return;
    }

    var file = this.importFileInput.current.files[0];
    var text = await blob2text(file);
    var data = JSON.parse(text);

    checkVersion(data.version);

    this.props.cookies.set('vocabulary', data.vocabulary);

    this.importFileInput.current.value = null;
  }

  render() {
    return (
      <div>
        <button name="exportBtn" onClick={ this.exportData }>Export</button><br />

        <form onSubmit={ this.importData }>
          <input type="file" ref={ this.importFileInput } />
          <button type="submit">Import</button>
        </form>
      </div>
    );
  }

}
