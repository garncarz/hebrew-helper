import { removeNiqqud, us2heKeyboard } from './lib.js';

it('removes niqqud correctly', () => {
  // TODO more examples
  expect(removeNiqqud('שְׁלֹשָׁה')).toBe('שלשה');
});

it('types like Hebrew keyboard', () => {
  expect(us2heKeyboard('akuo')).toBe('שלום');
});
