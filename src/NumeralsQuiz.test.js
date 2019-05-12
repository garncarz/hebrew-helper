import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import NumeralsQuiz from './NumeralsQuiz';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NumeralsQuiz />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('asking/checking logic', () => {
  var app = new NumeralsQuiz();
  app.numerals = app.items;  // old naming

  it('asks for 0 in English', () => {
    var num = app.numerals[0];
    num.from_eng = true;
    expect(num.getQuestion()).toEqual(0);
  });

  it('asks for 0 in Hebrew', () => {
    var num = app.numerals[0];
    num.from_eng = false;
    expect(num.getQuestion()).toEqual('אֶפֶס (efes)');
  });

  it('asks for 2 in Hebrew', () => {
    var num = app.numerals[2];
    num.from_eng = false;
    var q = num.getQuestion();
    expect(q === 'שְׁתַּיִם (shtayim)' || q === 'שְׁנַיִם (shnayim)');
  });

  it('checks for 1 in English', () => {
    var num = app.numerals[1];
    num.from_eng = false;
    expect(num.checkAnswer('1')).toEqual(true);
    expect(num.getHelp()).toBeFalsy();
  });

  it('checks for 1 in Hebrew (trans., fem.)', () => {
    var num = app.numerals[1];
    num.from_eng = true;
    expect(num.checkAnswer('achat')).toEqual('fem');
    expect(num.getHelp()).toContain('אַחַת (achat)');
  });

  it('checks for 1 in Hebrew (masc.)', () => {
    var num = app.numerals[1];
    num.from_eng = true;
    expect(num.checkAnswer('אֶחָד')).toEqual('masc');
    expect(num.getHelp()).toContain('אֶחָד (echad)');
  });

  it('checks for 10 in Hebrew (trans., fem., no \')', () => {
    var num = app.numerals[10];
    num.from_eng = true;
    expect(num.checkAnswer('eser')).toEqual('fem');
    expect(num.getHelp()).toContain('עֶשֶׂר (\'eser)');
  });

  it('checks for 10 in Hebrew (trans., masc., no \')', () => {
    var num = app.numerals[10];
    num.from_eng = true;
    expect(num.checkAnswer('assara')).toEqual('masc');
    expect(num.getHelp()).toContain('עֶשֶׂר (\'eser)');
  });

  it('does not require niqqud', () => {
    var num = app.numerals[2];
    num.from_eng = true;
    expect(num.checkAnswer('שתים')).toEqual('fem');
    expect(num.checkAnswer('שנים')).toEqual('masc');
  });

  it('needs correct niqqud if used', () => {
    var num = app.numerals[2];
    num.from_eng = true;
    expect(num.checkAnswer('שַׁתַּיִם')).toBeFalsy();
  });

});


describe('Enter key', () => {
  var wrapper, newQuestion_spy, checkAnswer_spy, input;

  beforeEach(() => {
    wrapper = mount(<NumeralsQuiz />);

    newQuestion_spy = jest.spyOn(wrapper.instance(), 'newQuestion');
    checkAnswer_spy = jest.spyOn(wrapper.instance(), 'checkAnswer');

    input = wrapper.find('input[type="text"]');
    // It seems `focus()` doesn't work in tests.
  });

  it('does not do anything if input box empty', () => {
    input.simulate('keyPress', {key: 'Enter'});

    expect(checkAnswer_spy).not.toHaveBeenCalled();
    expect(wrapper.state('ok')).toBeFalsy;
    expect(newQuestion_spy).not.toHaveBeenCalled();
  });

  it('jumps to the next question if answered correctly', () => {
    var item = wrapper.instance().items[0];
    item.from_eng = true;
    wrapper.setState({item: item});

    // auto us2heKeyboard transforms correct transcript to something else:
    // input.simulate('change', {target: {value: 'efes'}});

    // so let's type אֶפֶס like with a Hebrew keyboard:
    input.simulate('change', {target: {value: 'tpx'}});

    input.simulate('keyPress', {key: 'Enter'});

    expect(checkAnswer_spy).toHaveBeenCalled();
    expect(wrapper.state('ok')).toBeTruthy;  // Shouldn't it be falsy again after `newQuestion` is called? Weird.
    expect(newQuestion_spy).toHaveBeenCalled();
  });

  it('does not do anything if answered incorrectly', () => {
    var item = wrapper.instance().items[0];
    item.from_eng = false;
    wrapper.setState({item: item});

    input.simulate('change', {target: {value: 'efes'}});
    input.simulate('keyPress', {key: 'Enter'});

    expect(checkAnswer_spy).toHaveBeenCalled();
    expect(wrapper.state('ok')).toBeFalsy;
    expect(newQuestion_spy).not.toHaveBeenCalled();
  });

});
