/** Persian (فارسی) converter. */
import type { LocaleModule } from '../types.js';

const ONES = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده'];
const TEENS = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const TENS = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const HUNDREDS = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const SCALES = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون', 'کوینتیلیون'];

function under100(n: number): string {
  if (n <= 10) return n === 0 ? '' : n === 10 ? TEENS[0] : ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r === 0 ? TENS[t] : `${TENS[t]} و ${ONES[r]}`;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? HUNDREDS[h] : `${HUNDREDS[h]} و ${under100(r)}`;
}

function integer(digits: string): string {
  digits = digits.replace(/^0+/, '') || '0';
  if (digits === '0') return 'صفر';
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
      parts.push(under1000(v));
    } else if (v === 1) {
      parts.push(scale);
    } else {
      parts.push(`${under1000(v)} ${scale}`);
    }
  }
  return parts.join(' و ');
}

function digit(d: string): string {
  return Number(d) === 0 ? 'صفر' : ONES[Number(d)];
}

export const fa: LocaleModule = {
  integer: (digits) => integer(digits),
  digit: (d) => digit(d),
  defaults: { decimalSeparator: 'ممیز', negativePrefix: 'منفی' },
};
