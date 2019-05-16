import React from 'react';
import Cookies from 'universal-cookie';
import { mount } from 'enzyme';

import { blob2text } from './lib';
import { VERSION } from './version';
import { VocabularyQuiz, VocabularyTable } from './VocabularyQuiz';

var cookies, wrapper, input, btn;

const original_data = [
  ['one', 'אַחַת', 'achat'],
  ['two', 'שְׁתַּיִם', 'shtayim'],
  ['three', 'שָׁלֹשׁ', 'shalosh'],
];

beforeEach(() => {
  cookies = new Cookies({});

  wrapper = mount(<VocabularyTable cookies={ cookies } />);

  wrapper.setState({data: JSON.parse(JSON.stringify(original_data))});  // deep copy

  input = (name) => { return wrapper.find(`input[name="${name}"]`); }
  btn = (name) => { return wrapper.find(`button[name="${name}"]`); }
});

it('can add a new word', () => {
  expect(btn('addBtn').prop('disabled')).toEqual(true);
  input('eng').simulate('change', {target: {name: 'eng', value: 'hello'}});
  expect(btn('addBtn').prop('disabled')).toEqual(true);
  input('he').simulate('change', {target: {name: 'he', value: 'שלום'}});
  expect(btn('addBtn').prop('disabled')).toEqual(false);
  input('tr').simulate('change', {target: {name: 'tr', value: 'shalom'}});
  expect(btn('addBtn').prop('disabled')).toEqual(false);

  btn('addBtn').simulate('click');
  expect(wrapper.state('data')).toEqual([...original_data, ['hello', 'שלום', 'shalom']]);

  expect(cookies.cookies.vocabulary).toContain('hello');
  expect(cookies.cookies.vocabulary).toContain('שלום');
  expect(cookies.cookies.vocabulary).toContain('shalom');
});

it('can delete a word', () => {
  window.confirm = jest.fn();
  window.confirm.mockReturnValue(true);

  wrapper.find('.rt-tr button').at(1).simulate('click');

  expect(wrapper.state('data')).toEqual([original_data[0], original_data[2]]);

  expect(cookies.cookies.vocabulary).not.toContain('two');
  expect(cookies.cookies.vocabulary).not.toContain('שְׁתַּיִם');
  expect(cookies.cookies.vocabulary).not.toContain('shtayim');
});

it('can edit a word', () => {
  wrapper.find('.rt-td div').at(0).simulate('blur', {target: {innerHTML: 'jedna'}});
  wrapper.find('.rt-td div').at(5).simulate('blur', {target: {innerHTML: 'שְׁנַיִם'}});

  expect(wrapper.state('data')[0][0]).toEqual('jedna');
  expect(wrapper.state('data')[1][1]).toEqual('שְׁנַיִם');

  expect(cookies.cookies.vocabulary).not.toContain('one');
  expect(cookies.cookies.vocabulary).toContain('jedna');
  expect(cookies.cookies.vocabulary).not.toContain('שְׁתַּיִם');
  expect(cookies.cookies.vocabulary).toContain('שְׁנַיִם');
});

it('can export data', async () => {
  window.URL.createObjectURL = jest.fn();
  btn('exportBtn').simulate('click');

  var blob = window.URL.createObjectURL.mock.calls[0][0];
  expect(blob.type).toEqual('application/json');

  var text = await blob2text(blob);
  var data = JSON.parse(text);
  expect(data['version']).toEqual(VERSION);
  expect(data['data']).toEqual(wrapper.state('data'));
});

it('can (re)import data', async () => {
  window.URL.createObjectURL = jest.fn();
  btn('exportBtn').simulate('click');
  var blob = window.URL.createObjectURL.mock.calls[0][0];

  wrapper.setState({data: []}, wrapper.instance().afterStateSet);

  expect(cookies.cookies.vocabulary).toEqual('[]');

  // doesn't work, file is not uploaded then:
  // wrapper.find('input[type="file"]').simulate('change', {target: {files: [blob]}});

  wrapper.instance().importFileInput.current = jest.fn();
  wrapper.instance().importFileInput.current.files = [blob];

  // also doesn't work, not waiting for async:
  // wrapper.find('input[type="file"]').simulate('submit');

  var event = jest.fn();
  event.preventDefault = jest.fn();
  await wrapper.instance().importData(event);

  expect(wrapper.state('data')).toEqual(original_data);

  expect(cookies.cookies.vocabulary).toContain('one');
  expect(cookies.cookies.vocabulary).toContain('שְׁתַּיִם');
  expect(cookies.cookies.vocabulary).toContain('shalosh');
});
