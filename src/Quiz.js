import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { removeNiqqud, us2heKeyboard } from './lib.js';
import UsHeKeyboard from './keyboard';


export class QuizItem {

  newQuestion() {
    // TODO move to App ?
    this.from_eng = Math.random() >= 0.5;

    this.ok = false;

    return this.getQuestion();
  }

  removeNiqqud(str) {
    return removeNiqqud(str);
  }

}


export class Quiz extends React.Component {

  constructor(props) {
    super(props);

    this.items = [];

    this.state = {
      item: null,
      ok: false,
      question: '',
      answer: '',
      help: '',
    };

    this.inputRef = React.createRef();
  }

  componentDidMount = () => {
    this.newQuestion();
  }

  newQuestion = () => {
    if (this.items.length < 1) {
      return;
    }

    for (var i = 0; i < 5; i++) {
      // don't repeat questions immediately
      var item = this.items[Math.floor(Math.random() * this.items.length)];
      if (item !== this.state.item) {
        break;
      }
    }

    this.setState({
      item: item,
      ok: false,
      question: item.newQuestion(),
      answer: '',
      help: '',
    });

    this.inputRef.current.focus();
  }

  checkAnswer = (event) => {
    var answer = event.target.value || event.target.textContent || event.target.innerText;
    if (this.state.item.from_eng) {
      answer = us2heKeyboard(answer);
    }
    var ok = this.state.item.checkAnswer(answer.trim());

    this.setState({
      ok: ok,
      answer: answer,
      help: ok ? '✓\n' + this.state.item.getHelp() : '',
    });
  }

  showHelp = () => {
    this.setState({
      help: this.state.item.getHelp(),
    });

    this.inputRef.current.focus();
  }

  keyPress = (event) => {
    if (event.key === 'Enter' && this.state.ok) {
      this.newQuestion();
    }
    if (event.key === '?') {
      this.showHelp();
      event.preventDefault();
    }
  }

  addChar = (char) => {
    this.checkAnswer({ target: { value: this.state.answer + char } });
  }

  render() {
    if (this.items.length < 1) {
      return (
        <Alert variant="warning">
          Please add some vocabulary first.
        </Alert>
      );
    }

    return (
      <div className="text-center">
        <p className="display-1">{ this.state.question }</p>

        <Row className="justify-content-center my-4">
          <Col md="8">
            <div
              className="display-2 p-2"
              id="quizAnswer"
              contentEditable
              suppressContentEditableWarning
              onKeyPress={ this.keyPress }
              onInput={ this.checkAnswer }
              onBlur={ this.checkAnswer }
              ref={ this.inputRef }
              >
              { this.state.answer }
            </div>
          </Col>
        </Row>

        { this.state.ok
          ? <Button size="lg" onClick={ this.newQuestion }>Next</Button>
          : <Button size="lg" onClick={ this.showHelp }>Help</Button>
        }

        <p className="display-4" style={{ whiteSpace: 'pre-line', minHeight: '3em' }}>
          { this.state.help }
        </p>

        <UsHeKeyboard addChar={ this.addChar } />
      </div>
    );
  }

}


export class QuizTable extends React.Component {

  afterStateSet = () => { }

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.textContent || e.target.innerText;
          this.setState({ data }, this.afterStateSet);
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id],
        }}
      />
    );
  }

}
