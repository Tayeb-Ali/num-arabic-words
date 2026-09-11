/**
 * num-arabic-words — Convert numbers to words in Arabic, Hindi, French,
 * Persian and Russian. Zero runtime dependencies. Works in Node (CJS/ESM),
 * Deno, Bun, browsers, and any JS/TS framework.
 *
 * @example
 * ```ts
 * import { tafqeet } from 'num-arabic-words';
 * tafqeet(123); // "مائة وثلاثة وعشرون" (Arabic by default)
 * tafqeet(123, { locale: 'fr' }); // "cent vingt-trois"
 * ```
 */

import type { Locale, LocaleModule, NumericInput, ParsedNumber, TafqeetOptions } from './types.js';
import { ar } from './locales/ar.js';
import { hi } from './locales/hi.js';
import { fr } from './locales/fr.js';
import { fa } from './locales/fa.js';
import { ru } from './locales/ru.js';

export type { Locale, NumericInput, ParsedNumber, TafqeetOptions };

const MAX_INTEGER_DIGITS = 18;

const LOCALES: Record<Locale, LocaleModule> = { ar, hi, fr, fa, ru };

const AR_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

export function parseInput(input: NumericInput): ParsedNumber {
  let s: string;
  if (typeof input === 'bigint') {
    s = input.toString();
  } else if (typeof input === 'number') {
    if (!Number.isFinite(input)) throw new TypeError('Input must be a finite number');
    s = String(input);
    if (/[eE]/.test(s)) {
      throw new RangeError('Exponential notation not supported — pass large numbers as string or bigint');
    }
  } else if (typeof input === 'string') {
    s = input;
  } else {
    throw new TypeError('Input must be number, string or bigint');
  }

  s = s.trim();
  if (!s) throw new TypeError('Empty input');

  // Unify digits: Arabic-Indic + Persian -> Latin (shared by ar/fa, harmless elsewhere).
  s = s.replace(/[٠-٩۰-۹]/g, (d) => AR_DIGITS[d] ?? d);
  // Arabic decimal separator ٫ -> .
  s = s.replace(/٫/g, '.');
  // Remove grouping separators: comma, Arabic comma, spaces, underscores, apostrophes.
  s = s.replace(/[,،\s_']/g, '');

  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) throw new TypeError(`Invalid numeric input: "${String(input).slice(0, 32)}"`);
  const negative = m[1] === '-';
  const intDigits = m[2].replace(/^0+/, '') || '0';
  const fracDigits = (m[3] ?? '').replace(/0+$/, ''); // drop trailing zeros: 1.50 -> 1.5

  if (intDigits.length > MAX_INTEGER_DIGITS) {
    throw new RangeError(
      `Integer part too large (${intDigits.length} digits, max ${MAX_INTEGER_DIGITS}). ` +
      'Pass a smaller number or split it into chunks.'
    );
  }
  return { negative, intDigits, fracDigits };
}

/**
 * Convert a number to words in the requested locale (default: Arabic).
 *
 * @example tafqeet(123) // "مائة وثلاثة وعشرون"
 * @example tafqeet(123, { locale: 'fr' }) // "cent vingt-trois"
 * @example tafqeet(100000, { locale: 'hi' }) // "एक लाख"
 * @example tafqeet(2, { locale: 'ru' }) // "два"
 */
export function tafqeet(input: NumericInput, options: TafqeetOptions = {}): string {
  const { locale = 'ar', feminine = false, decimalSeparator, negativePrefix } = options;
  const mod = LOCALES[locale];
  if (!mod) throw new RangeError(`Unsupported locale: "${locale}". Supported: ${Object.keys(LOCALES).join(', ')}`);
  const { negative, intDigits, fracDigits } = parseInput(input);

  let out = mod.integer(intDigits, feminine);

  if (fracDigits) {
    const sep = decimalSeparator ?? mod.defaults.decimalSeparator;
    const fracWords = fracDigits
      .split('')
      .map((d) => mod.digit(d, feminine))
      .join(' ');
    out += ` ${sep} ${fracWords}`;
  }

  if (negative && !/^0+$/.test(intDigits + fracDigits)) {
    out = `${negativePrefix ?? mod.defaults.negativePrefix} ${out}`;
  }
  return out;
}

/** Backward-compatible alias (v1 name). */
export const numWords = tafqeet;

export default tafqeet;
