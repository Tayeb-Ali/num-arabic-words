/** Shared types for num-arabic-words locales. */

export type Locale = 'ar' | 'hi' | 'fr' | 'fa' | 'ru';

export interface TafqeetOptions {
  /** Target language (default: 'ar') */
  locale?: Locale;
  /** Feminine forms where the language supports them (default: false) */
  feminine?: boolean;
  /** Word between integer and fraction (default per locale) */
  decimalSeparator?: string;
  /** Prefix for negative numbers (default per locale) */
  negativePrefix?: string;
}

export type NumericInput = number | string | bigint;

export interface ParsedNumber {
  negative: boolean;
  intDigits: string;
  fracDigits: string;
}

/** Contract every locale module must satisfy. */
export interface LocaleModule {
  /** Spell the integer part (digits only, no sign, length <= 18). */
  integer: (digits: string, feminine: boolean) => string;
  /** Spell a single 0-9 digit (fractional part). */
  digit: (d: string, feminine: boolean) => string;
  defaults: { decimalSeparator: string; negativePrefix: string };
}
