/** Hindi (हिन्दी) converter — Indian numbering system (हज़ार / लाख / करोड़ ...). */
import type { LocaleModule } from '../types.js';

// 0-99 use unique words in Hindi.
const UNDER_100 = [
  'शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अट्ठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
  'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे',
];

// Scales for the 2-digit groups above the first 3-digit group.
const SCALES = ['', 'हज़ार', 'लाख', 'करोड़', 'अरब', 'खरब', 'नील', 'पद्म', 'शंख'];

function under1000(n: number): string {
  if (n < 100) return UNDER_100[n];
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = h === 1 ? 'सौ' : `${UNDER_100[h]} सौ`;
  return r === 0 ? head : `${head} ${UNDER_100[r]}`;
}

function integer(digits: string): string {
  digits = digits.replace(/^0+/, '') || '0';
  if (digits === '0') return UNDER_100[0];
  // Indian grouping: last 3 digits, then groups of 2.
  const units = Number(digits.slice(-3));
  let rest = digits.slice(0, -3);
  const scaled: Array<{ v: number; s: number }> = [];
  let s = 1;
  while (rest.length > 0) {
    const v = Number(rest.slice(-2));
    if (v !== 0) {
      const scale = SCALES[s];
      if (!scale) throw new RangeError(`Scale ${s} out of range`);
      scaled.unshift({ v, s });
    }
    rest = rest.slice(0, -2);
    s++;
  }
  const out = scaled.map(({ v, s: si }) => `${UNDER_100[v]} ${SCALES[si]}`);
  if (units !== 0) out.push(under1000(units));
  return out.join(' ');
}

function digit(d: string): string {
  return UNDER_100[Number(d)];
}

export const hi: LocaleModule = {
  integer: (digits) => integer(digits),
  digit: (d) => digit(d),
  defaults: { decimalSeparator: 'दशमलव', negativePrefix: 'ऋणात्मक' },
};
