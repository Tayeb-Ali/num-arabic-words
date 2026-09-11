/** Russian (русский) converter — gender + plural declension. */
import type { LocaleModule } from '../types.js';

const ONES_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять'];
const ONES_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять'];
const TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

// [one, few, many] — тысяча is feminine, the rest masculine.
const SCALES: Array<[string, string, string]> = [
  ['', '', ''],
  ['тысяча', 'тысячи', 'тысяч'],
  ['миллион', 'миллиона', 'миллионов'],
  ['миллиард', 'миллиарда', 'миллиардов'],
  ['триллион', 'триллиона', 'триллионов'],
  ['квадриллион', 'квадриллиона', 'квадриллионов'],
  ['квинтиллион', 'квинтиллиона', 'квинтиллионов'],
];

function pluralIndex(v: number): number {
  const d10 = v % 10;
  const d100 = v % 100;
  if (d10 === 1 && d100 !== 11) return 0;
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return 1;
  return 2;
}

function under100(n: number, feminine: boolean): string {
  const ones = feminine ? ONES_F : ONES_M;
  if (n <= 10) return ones[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r === 0 ? TENS[t] : `${TENS[t]} ${ones[r]}`;
}

function under1000(n: number, feminine: boolean): string {
  if (n < 100) return under100(n, feminine);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? HUNDREDS[h] : `${HUNDREDS[h]} ${under100(r, feminine)}`;
}

function integer(digits: string, feminine: boolean): string {
  digits = digits.replace(/^0+/, '') || '0';
  if (digits === '0') return 'ноль';
  const groups: number[] = [];
  for (let i = digits.length; i > 0; i -= 3) {
    groups.push(Number(digits.slice(Math.max(0, i - 3), i)));
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const v = groups[i];
    if (v === 0) continue;
    if (i === 0) {
      parts.push(under1000(v, feminine));
      continue;
    }
    const forms = SCALES[i];
    if (!forms) throw new RangeError(`Scale ${i} out of range`);
    const groupFeminine = i === 1 ? true : false; // тысяча is feminine
    parts.push(`${under1000(v, groupFeminine)} ${forms[pluralIndex(v)]}`);
  }
  return parts.join(' ');
}

function digit(d: string, feminine: boolean): string {
  const n = Number(d);
  if (n === 0) return 'ноль';
  return (feminine ? ONES_F : ONES_M)[n];
}

export const ru: LocaleModule = {
  integer,
  digit,
  defaults: { decimalSeparator: 'запятая', negativePrefix: 'минус' },
};
