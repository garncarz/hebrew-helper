import React from 'react';
import Cookies from 'universal-cookie';
import { mount } from 'enzyme';

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

  wrapper.setState({data: [...original_data]});

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
});

it('can delete a word', () => {
  window.confirm = jest.fn();
  window.confirm.mockReturnValue(true);

  wrapper.find('.rt-tr button').at(1).simulate('click');

  expect(wrapper.state('data')).toEqual([original_data[0], original_data[2]]);
});
