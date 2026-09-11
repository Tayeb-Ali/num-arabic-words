# num-arabic-words

Convert numbers to words in **Arabic, Hindi, French, Persian and Russian** —
correct native grammar, zero runtime dependencies, works everywhere
JavaScript/TypeScript runs.

```js
tafqeet(12345); // "اثنا عشر ألف وثلاثمائة وخمسة وأربعون" (Arabic by default)
tafqeet(12345, { locale: 'fr' }); // "douze mille trois cent quarante-cinq"
```

> 🌍 Arabic translation: see [README.ar.md](./README.ar.md).
> v2 is a full rewrite. v1 bugs fixed: reversed tens (`عشرون واحد` →
> `واحد وعشرون`), broken hundreds (`واحد مائة` → `مائة / مائتان / ثلاثمائة`),
> missing dual/plural forms (`ألف / ألفان / آلاف`, `مليون / مليونان / ملايين`),
> spelling (`اربعه` → `أربعة`), plus ESM, TypeScript and browser support.

## Install

```bash
npm i num-arabic-words
```

No dependencies. Node `>=18`. Ships CJS + ESM + UMD + `.d.ts`.

## Usage

### Node (CommonJS)

```js
const tafqeet = require('num-arabic-words'); // callable (v1 compatible)
const { tafqeet, numWords } = require('num-arabic-words'); // named too

tafqeet(123); // "مائة وثلاثة وعشرون"
numWords(2000); // "ألفان" (v1 alias)
```

### Node / Bundlers (ESM — Vite, Next.js, Nuxt)

```js
import { tafqeet } from 'num-arabic-words';
import tafqeetDefault from 'num-arabic-words';
```

### TypeScript / React / Angular / Vue

```ts
import { tafqeet, type TafqeetOptions } from 'num-arabic-words';

const opts: TafqeetOptions = { feminine: true };
tafqeet(2, opts); // "اثنتان"
```

### Deno

```ts
import { tafqeet } from 'npm:num-arabic-words';
```

### Bun

```ts
import { tafqeet } from 'num-arabic-words';
```

### Browser (CDN, no build step)

```html
<script src="https://unpkg.com/num-arabic-words/dist/umd/num-arabic-words.js"></script>
<script>
  NumArabicWords.tafqeet(12345); // "اثنا عشر ألف وثلاثمائة وخمسة وأربعون"
</script>
```

## Supported languages

| `locale` | Language | System | Example (`12345`) |
|---|---|---|---|
| `'ar'` (default) | Arabic (MSA) | thousand/million/milliard | اثنا عشر ألف وثلاثمائة وخمسة وأربعون |
| `'hi'` | Hindi (हिन्दी) | Indian: हज़ार/लाख/करोड़ | बारह हज़ार तीन सौ पैंतालीस |
| `'fr'` | French (français) | long scale: million/milliard | douze mille trois cent quarante-cinq |
| `'fa'` | Persian (فارسی) | هزار/میلیون/میلیارد | دوازده هزار و سیصد و چهل و پنج |
| `'ru'` | Russian (русский) | тысяча/миллион/миллиард + declension | двенадцать тысяч триста сорок пять |

```ts
tafqeet(100000, { locale: 'hi' }); // "एक लाख"
tafqeet(2000, { locale: 'ru' }); // "две тысячи"
tafqeet(71, { locale: 'fr' }); // "soixante et onze"
tafqeet(-5, { locale: 'fa' }); // "منفی پنج"
```

## API

```ts
tafqeet(input: number | string | bigint, options?: TafqeetOptions): string
```

| Option | Default | Meaning |
|---|---|---|
| `locale` | `'ar'` | `'ar' \| 'hi' \| 'fr' \| 'fa' \| 'ru'` |
| `feminine` | `false` | Feminine forms where supported (ar: `واحدة/اثنتان`، fr: `une`، ru: `одна/две`) |
| `decimalSeparator` | `'فاصلة'` | Word between the integer and fraction parts |
| `negativePrefix` | `'سالب'` | Prefix for negative numbers |

### Input rules

- `number`, numeric `string`, or `bigint`.
- Arabic-Indic / Persian digits accepted: `tafqeet('١٢٣')`.
- Grouping separators ignored: `tafqeet('1,000')` → `"ألف"`.
- Decimals: the fraction is spoken digit-by-digit, leading zeros preserved:
  `tafqeet('1.05')` → `"واحد فاصلة صفر خمسة"`.
- Range: integer part up to **18 digits** (up to quintillion / كوينتيليون).
  Larger values throw `RangeError`; malformed input throws `TypeError`.

## Examples

```js
tafqeet(0); // "صفر"
tafqeet(21); // "واحد وعشرون"
tafqeet(100); // "مائة"
tafqeet(200); // "مائتان"
tafqeet(300); // "ثلاثمائة"
tafqeet(1000); // "ألف"
tafqeet(2000); // "ألفان"
tafqeet(3000); // "ثلاثة آلاف"
tafqeet(1000000); // "مليون"
tafqeet(2000000); // "مليونان"
tafqeet(3000000); // "ثلاثة ملايين"
tafqeet(1000000000); // "مليار"
tafqeet(-5); // "سالب خمسة"
tafqeet(1.5); // "واحد فاصلة خمسة"
tafqeet(2, { feminine: true }); // "اثنتان"
tafqeet(1000000000000000n); // "كوادريليون"
```

## How it works

1. **Normalize** (`parseInput`): map Arabic-Indic/Persian digits to Latin,
   strip grouping separators (`, ، space _ '`), split sign / integer / fraction,
   validate the shape, enforce the 18-digit limit.
2. **Group** the integer into 3-digit chunks from the right; each chunk maps to
   a scale: `ألف، مليون، مليار، تريليون، كوادريليون، كوينتيليون`.
3. **Decline** each chunk: `1` → singular (`ألف`), `2` → dual (`ألفان`),
   `3–10` → plural (`آلاف`), `11+` → singular (`ألف`).
4. **Spell** chunks below 1000 via the hundreds table
   (`مائة، مائتان، ثلاثمائة ... تسعمائة`) plus tens in the correct order
   (`واحد وعشرون`, not `عشرون واحد`).
5. **Join** non-empty parts with `و`, then append the fraction digit-by-digit
   after `فاصلة` and prefix negatives with `سالب`.

## Development

```bash
npm install
npm run build   # tsc → dist/cjs + dist/esm, esbuild → dist/umd (devDeps: typescript, esbuild)
npm test        # build + node --test (no test framework needed)
```

Project layout:

```
src/index.ts          # dispatcher + input parsing (locale: ar/hi/fr/fa/ru)
src/types.ts          # Locale, TafqeetOptions, NumericInput
src/locales/ar.ts     # Arabic (MSA, default)
src/locales/hi.ts     # Hindi (Indian system)
src/locales/fr.ts     # French (long scale)
src/locales/fa.ts     # Persian
src/locales/ru.ts     # Russian (declension)
test/numbers.test.mjs # 85 cases, Node built-in runner
scripts/build.mjs     # tsc + esbuild UMD (devDeps: typescript, esbuild)
```

## License

MIT
