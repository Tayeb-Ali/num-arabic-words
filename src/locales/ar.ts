/** Arabic (MSA) converter — the default locale. */
import type { LocaleModule } from '../types.js';

const ONES_M = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
const ONES_F = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع', 'عشر'];
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

interface Scale { singular: string; dual: string; plural: string }

const SCALES: Scale[] = [
  { singular: '', dual: '', plural: '' },
  { singular: 'ألف', dual: 'ألفان', plural: 'آلاف' },
  { singular: 'مليون', dual: 'مليونان', plural: 'ملايين' },
  { singular: 'مليار', dual: 'ملياران', plural: 'مليارات' },
  { singular: 'تريليون', dual: 'تريليونان', plural: 'تريليونات' },
  { singular: 'كوادريليون', dual: 'كوادريليونان', plural: 'كوادريليونات' },
  { singular: 'كوينتيليون', dual: 'كوينتيليونان', plural: 'كوينتيليونات' },
];

function under100(n: number, feminine: boolean): string {
  const ones = feminine ? ONES_F : ONES_M;
  if (n <= 10) return ones[n];
  if (n < 20) {
    if (n === 11) return feminine ? 'إحدى عشرة' : 'أحد عشر';
    if (n === 12) return feminine ? 'اثنتا عشرة' : 'اثنا عشر';
    return ones[n - 10] + (feminine ? ' عشرة' : ' عشر');
  }
  const t = Math.floor(n / 10);
  const r = n % 10;
  if (r === 0) return TENS[t];
  return ones[r] + ' و' + TENS[t];
}

function under1000(n: number, feminine: boolean): string {
  if (n < 100) return under100(n, feminine);
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (r === 0) return HUNDREDS[h];
  return HUNDREDS[h] + ' و' + under100(r, feminine);
}

function scaleGroup(value: number, scaleIndex: number, feminine: boolean): string {
  if (value === 0) return '';
  if (scaleIndex === 0) return under1000(value, feminine);
  const scale = SCALES[scaleIndex];
  if (!scale) throw new RangeError(`Scale ${scaleIndex} out of range`);
  if (value === 1) return scale.singular;
  if (value === 2) return scale.dual;
  if (value <= 10) return under1000(value, feminine) + ' ' + scale.plural;
  return under1000(value, feminine) + ' ' + scale.singular;
}

function integer(digits: string, feminine: boolean): string {
  digits = digits.replace(/^0+/, '') || '0';
  if (digits === '0') return 'صفر';
  const groups: number[] = [];
  for (let i = digits.length; i > 0; i -= 3) {
    groups.push(Number(digits.slice(Math.max(0, i - 3), i)));
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const w = scaleGroup(groups[i], i, feminine);
    if (w) parts.push(w);
  }
  return parts.join(' و');
}

function digit(d: string, feminine: boolean): string {
  const n = Number(d);
  if (n === 0) return 'صفر';
  return (feminine ? ONES_F : ONES_M)[n];
}

export const ar: LocaleModule = {
  integer,
  digit,
  defaults: { decimalSeparator: 'فاصلة', negativePrefix: 'سالب' },
};
