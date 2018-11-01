import React from 'react';
import ReactDOM from 'react-dom';
import App, { Numerals } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('asks for 0 in English', () => {
  var nums = new Numerals();
  var num = nums.numerals[0];
  num.from_eng = true;
  expect(num.getQuestion()).toEqual(0);
});

it('asks for 0 in Hebrew', () => {
  var nums = new Numerals();
  var num = nums.numerals[0];
  num.from_eng = false;
  expect(num.getQuestion()).toEqual('אֶפֶס (efes)');
});

it('asks for 2 in Hebrew', () => {
  var nums = new Numerals();
  var num = nums.numerals[2];
  num.from_eng = false;
  var q = num.getQuestion();
  expect(q === 'שְׁתַּיִם (shtayim)' || q === 'שְׁנַיִם (shnayim)');
});

it('checks for 1 in English', () => {
  var nums = new Numerals();
  var num = nums.numerals[1];
  num.from_eng = false;
  expect(num.checkAnswer('1')).toEqual(true);
  expect(num.getHelp()).toBeFalsy();
});

it('checks for 1 in Hebrew (trans., fem.)', () => {
  var nums = new Numerals();
  var num = nums.numerals[1];
  num.from_eng = true;
  expect(num.checkAnswer('achat')).toEqual('fem');
  expect(num.getHelp()).toEqual('אַחַת (achat)');
});

it('checks for 1 in Hebrew (masc.)', () => {
  var nums = new Numerals();
  var num = nums.numerals[1];
  num.from_eng = true;
  expect(num.checkAnswer('אֶחָד')).toEqual('masc');
  expect(num.getHelp()).toEqual('אֶחָד (echad)');
});
