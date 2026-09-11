/** French (français) converter — long scale (million / milliard / billion ...). */
import type { LocaleModule } from '../types.js';

const UNDER_17 = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
];
const TENS: Record<number, string> = {
  2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante',
};
const SCALES = ['', 'mille', 'million', 'milliard', 'billion', 'billiard', 'trillion'];

function one(feminine: boolean): string {
  return feminine ? 'une' : 'un';
}

function under100(n: number, feminine: boolean): string {
  if (n <= 16) return n === 1 ? one(feminine) : UNDER_17[n];
  if (n < 20) return 'dix-' + UNDER_17[n - 10]; // 17-19
  if (n < 70) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    if (r === 0) return TENS[t];
    if (r === 1) return `${TENS[t]} et ${one(feminine)}`; // 21, 31, ... 61
    return `${TENS[t]}-${n === 1 ? one(feminine) : UNDER_17[r]}`;
  }
  if (n < 80) {
    // 70-79 = 60 + 10..19
    const r = n - 60;
    if (r === 11) return `soixante et onze`;
    return `soixante-${r <= 16 ? UNDER_17[r] : under100(r, feminine)}`;
  }
  // 80-99 = 4×20 + remainder
  const r = n - 80;
  if (r === 0) return 'quatre-vingts';
  if (r === 1 && !feminine) return 'quatre-vingt-un';
  if (r === 1) return 'quatre-vingt-une';
  return `quatre-vingt-${r <= 16 ? UNDER_17[r] : under100(r, feminine)}`;
}

function under1000(n: number, feminine: boolean): string {
  if (n < 100) return under100(n, feminine);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = h === 1 ? 'cent' : `${UNDER_17[h]} cent${r === 0 ? 's' : ''}`;
  return r === 0 ? head : `${head} ${under100(r, feminine)}`;
}

function integer(digits: string, feminine: boolean): string {
  digits = digits.replace(/^0+/, '') || '0';
  if (digits === '0') return 'zéro';
  const groups: number[] = [];
  for (let i = digits.length; i > 0; i -= 3) {
    groups.push(Number(digits.slice(Math.max(0, i - 3), i)));
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const v = groups[i];
    if (v === 0) continue;
    const scale = SCALES[i];
    if (scale === undefined) throw new RangeError(`Scale ${i} out of range`);
    if (i === 0) {
      parts.push(under1000(v, feminine));
    } else if (i === 1) {
      // mille is invariable, never takes "un"
      parts.push(v === 1 ? 'mille' : `${under1000(v, false)} mille`);
    } else {
      parts.push(v === 1 ? `un ${scale}` : `${under1000(v, false)} ${scale}s`);
    }
  }
  return parts.join(' ');
}

function digit(d: string, feminine: boolean): string {
  const n = Number(d);
  if (n === 1) return one(feminine);
  return UNDER_17[n];
}

export const fr: LocaleModule = {
  integer,
  digit,
  defaults: { decimalSeparator: 'virgule', negativePrefix: 'moins' },
};
