import { removeNiqqud } from './lib.js';

it('removes niqqud correctly', () => {
  // TODO more examples
  expect(removeNiqqud('שְׁלֹשָׁה')).toBe('שלשה');
});
