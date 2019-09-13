import React from 'react';
import Cookies from 'universal-cookie';
import { mount } from 'enzyme';

import { blob2text } from './lib';
import { VERSION } from './version';
import Settings from './Settings';

const original_data = [
  ['one', 'אַחַת', 'achat'],
  ['two', 'שְׁתַּיִם', 'shtayim'],
  ['three', 'שָׁלֹשׁ', 'shalosh'],
];

var cookies, wrapper;

function btn(name) { return wrapper.find(`button[name="${name}"]`); }

beforeEach(() => {
  cookies = new Cookies();
  cookies.set('vocabulary', original_data);

  wrapper = mount(<Settings cookies={ cookies } />);
});

it('can export data', async () => {
  window.URL.createObjectURL = jest.fn();
  btn('exportBtn').simulate('click');

  var blob = window.URL.createObjectURL.mock.calls[0][0];
  expect(blob.type).toEqual('application/json');

  var text = await blob2text(blob);
  var data = JSON.parse(text);
  expect(data['version']).toEqual(VERSION);
  expect(data['vocabulary']).toEqual(original_data);
});

it('can (re)import data', async () => {
  window.confirm = jest.fn();
  window.confirm.mockReturnValue(true);

  window.URL.createObjectURL = jest.fn();
  btn('exportBtn').simulate('click');
  var blob = window.URL.createObjectURL.mock.calls[0][0];

  cookies.set('vocabulary', []);
  expect(cookies.cookies.vocabulary).toEqual('[]');

  // doesn't work, file is not uploaded then:
  // wrapper.find('input[type="file"]').simulate('change', { target: { files: [blob] } });

  wrapper.instance().importFileInput.current = jest.fn();
  wrapper.instance().importFileInput.current.files = [blob];

  // also doesn't work, not waiting for async:
  // wrapper.find('input[type="file"]').simulate('submit');

  var event = jest.fn();
  event.preventDefault = jest.fn();
  await wrapper.instance().importData(event);

  expect(cookies.cookies.vocabulary).toContain('one');
  expect(cookies.cookies.vocabulary).toContain('שְׁתַּיִם');
  expect(cookies.cookies.vocabulary).toContain('shalosh');
});
