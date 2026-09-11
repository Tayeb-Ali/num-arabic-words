// Run: npm test  (uses Node built-in test runner — no dev deps needed for tests)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tafqeet, numWords } from '../dist/esm/index.js';

const cases = [
  [0, 'صفر'],
  [1, 'واحد'],
  [2, 'اثنان'],
  [3, 'ثلاثة'],
  [10, 'عشرة'],
  [11, 'أحد عشر'],
  [12, 'اثنا عشر'],
  [13, 'ثلاثة عشر'],
  [19, 'تسعة عشر'],
  [20, 'عشرون'],
  [21, 'واحد وعشرون'],
  [30, 'ثلاثون'],
  [99, 'تسعة وتسعون'],
  [100, 'مائة'],
  [101, 'مائة وواحد'],
  [200, 'مائتان'],
  [300, 'ثلاثمائة'],
  [123, 'مائة وثلاثة وعشرون'],
  [1000, 'ألف'],
  [1001, 'ألف وواحد'],
  [2000, 'ألفان'],
  [3000, 'ثلاثة آلاف'],
  [10000, 'عشرة آلاف'],
  [11000, 'أحد عشر ألف'],
  [12345, 'اثنا عشر ألف وثلاثمائة وخمسة وأربعون'],
  [1000000, 'مليون'],
  [2000000, 'مليونان'],
  [3000000, 'ثلاثة ملايين'],
  [1000000000, 'مليار'],
  [2000000000, 'ملياران'],
  [-5, 'سالب خمسة'],
  ['١٢٣', 'مائة وثلاثة وعشرون'],
  ['1,000', 'ألف'],
  [1000000000000000n, 'كوادريليون'],
];

describe('tafqeet', () => {
  for (const [input, expected] of cases) {
    it(`${String(input)} -> ${expected}`, () => {
      assert.equal(tafqeet(input), expected);
    });
  }

  it('decimals: 1.5', () => assert.equal(tafqeet(1.5), 'واحد فاصلة خمسة'));
  it('decimals preserve leading zero: 1.05', () => assert.equal(tafqeet('1.05'), 'واحد فاصلة صفر خمسة'));
  it('feminine: 1 -> واحدة', () => assert.equal(tafqeet(1, { feminine: true }), 'واحدة'));
  it('feminine: 2 -> اثنتان', () => assert.equal(tafqeet(2, { feminine: true }), 'اثنتان'));
  it('numWords alias matches tafqeet', () => assert.equal(numWords(123), tafqeet(123)));
  it('rejects empty', () => assert.throws(() => tafqeet(''), TypeError));
  it('rejects abc', () => assert.throws(() => tafqeet('abc'), TypeError));
  it('rejects overflow >18 digits', () => assert.throws(() => tafqeet('1234567890123456789'), RangeError));
  it('trailing zeros trimmed: 1.50 -> 1.5 words', () => assert.equal(tafqeet('1.50'), 'واحد فاصلة خمسة'));
  it('whole decimal dropped: 1.00 -> واحد', () => assert.equal(tafqeet('1.00'), 'واحد'));
});

describe('locales', () => {
  const per = [
    // Hindi — Indian system
    ['hi', 0, 'शून्य'],
    ['hi', 21, 'इक्कीस'],
    ['hi', 100, 'सौ'],
    ['hi', 1000, 'एक हज़ार'],
    ['hi', 12345, 'बारह हज़ार तीन सौ पैंतालीस'],
    ['hi', 100000, 'एक लाख'],
    ['hi', 10000000, 'एक करोड़'],
    ['hi', 1000000000, 'एक अरब'],
    ['hi', 1.5, 'एक दशमलव पाँच'],
    // French — long scale
    ['fr', 0, 'zéro'],
    ['fr', 21, 'vingt et un'],
    ['fr', 71, 'soixante et onze'],
    ['fr', 80, 'quatre-vingts'],
    ['fr', 91, 'quatre-vingt-onze'],
    ['fr', 100, 'cent'],
    ['fr', 200, 'deux cents'],
    ['fr', 201, 'deux cent un'],
    ['fr', 1000, 'mille'],
    ['fr', 12345, 'douze mille trois cent quarante-cinq'],
    ['fr', 1000000, 'un million'],
    ['fr', 1000000000, 'un milliard'],
    // Persian
    ['fa', 0, 'صفر'],
    ['fa', 21, 'بیست و یک'],
    ['fa', 100, 'یکصد'],
    ['fa', 200, 'دویست'],
    ['fa', 1000, 'هزار'],
    ['fa', 12345, 'دوازده هزار و سیصد و چهل و پنج'],
    ['fa', -5, 'منفی پنج'],
    // Russian — declension
    ['ru', 0, 'ноль'],
    ['ru', 1, 'один'],
    ['ru', 2, 'два'],
    ['ru', 1000, 'одна тысяча'],
    ['ru', 2000, 'две тысячи'],
    ['ru', 5000, 'пять тысяч'],
    ['ru', 12345, 'двенадцать тысяч триста сорок пять'],
    ['ru', 1000000, 'один миллион'],
    ['ru', 2000000, 'два миллиона'],
  ];
  for (const [locale, input, expected] of per) {
    it(`${locale} ${String(input)} -> ${expected}`, () => {
      assert.equal(tafqeet(input, { locale }), expected);
    });
  }
  it('fr feminine: 1 -> une', () => assert.equal(tafqeet(1, { locale: 'fr', feminine: true }), 'une'));
  it('ru feminine: 1 -> одна', () => assert.equal(tafqeet(1, { locale: 'ru', feminine: true }), 'одна'));
  it('ru decimal: 2.25', () => assert.equal(tafqeet(2.25, { locale: 'ru' }), 'два запятая два пять'));
  it('rejects unknown locale', () => assert.throws(() => tafqeet(1, { locale: 'xx' }), RangeError));
});
