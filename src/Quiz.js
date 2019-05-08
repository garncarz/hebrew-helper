import React from 'react';

import { removeNiqqud } from './lib.js';


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
    var item = this.items[Math.floor(Math.random() * this.items.length)];

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
    var answer = event.target.value.trim();
    var ok = this.state.item.checkAnswer(answer);

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
  }

  render() {
    return (
      <div className="content">
        <p>{ this.state.question }</p>
        <input type="text" ref={this.inputRef} onChange={this.checkAnswer}
          onKeyPress={this.keyPress} value={this.state.answer} />
        { this.state.ok
          ? <input type="button" onClick={this.newQuestion} value="Next" />
          : <input type="button" onClick={this.showHelp} value="Help" />
        }
        <p className="help">{ this.state.help }</p>
      </div>
    );
  }

}
