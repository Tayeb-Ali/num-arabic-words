# num-arabic-words — تفقيط الأرقام بخمس لغات

تحويل الأرقام إلى كلمات **بالعربية والهندية والفرنسية والفارسية والروسية**
بقواعد سليمة، بدون أي اعتماديات تشغيلية، ويعمل في كل بيئة يعمل فيها
JavaScript/TypeScript.

```js
tafqeet(12345); // "اثنا عشر ألف وثلاثمائة وخمسة وأربعون" (العربية افتراضياً)
tafqeet(12345, { locale: 'fr' }); // "douze mille trois cent quarante-cinq"
```

> 🌍 هذه هي الترجمة العربية. النسخة الإنجليزية الأصلية: [README.md](./README.md).
> This is the Arabic translation. The original English version is
> [README.md](./README.md).
> الإصدار 2 إعادة كتابة كاملة. أُصلحت أخطاء الإصدار 1: ترتيب العشرات
> (`عشرون واحد` ← `واحد وعشرون`)، والمئات (`واحد مائة` ←
> `مائة / مائتان / ثلاثمائة`)، وصيغ المثنى والجمع (`ألف / ألفان / آلاف`،
> `مليون / مليونان / ملايين`)، والإملاء (`اربعه` ← `أربعة`)، مع دعم ESM
> وتايب سكربت والمتصفح.

## التثبيت | Install

```bash
npm i num-arabic-words
```

بدون اعتماديات. يتطلب Node `>=18`. يتضمن CJS + ESM + UMD + ملفات `.d.ts`.

## الاستخدام | Usage

### Node ‏(CommonJS) — للترجمة الإنجليزية الكاملة انظر [README.md](./README.md)

```js
const tafqeet = require('num-arabic-words'); // دالة مباشرة (متوافقة مع v1)
const { tafqeet, numWords } = require('num-arabic-words'); // أو أسماء مسماة

tafqeet(123); // "مائة وثلاثة وعشرون"
numWords(2000); // "ألفان" (اسم v1 القديم)
```

### ‏(ESM — Vite وNext.js وNuxt)

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

### المتصفح (CDN بدون بناء)

```html
<script src="https://unpkg.com/num-arabic-words/dist/umd/num-arabic-words.js"></script>
<script>
  NumArabicWords.tafqeet(12345); // "اثنا عشر ألف وثلاثمائة وخمسة وأربعون"
</script>
```

## اللغات المدعومة | Supported languages

| `locale` | اللغة | النظام | مثال (`12345`) |
|---|---|---|---|
| `'ar'` (افتراضي) | العربية | ألف/مليون/مليار | اثنا عشر ألف وثلاثمائة وخمسة وأربعون |
| `'hi'` | الهندية (हिन्दी) | هندي: हज़ार/लाख/करोड़ | बारह हज़ार तीन सौ पैंतालीस |
| `'fr'` | الفرنسية (français) | طويل: million/milliard | douze mille trois cent quarante-cinq |
| `'fa'` | الفارسية (فارسی) | هزار/میلیون/میلیارد | دوازده هزار و سیصد و چهل و پنج |
| `'ru'` | الروسية (русский) | тысяча/миллион/миллиард + إعراب | двенадцать тысяч триста сорок пять |

```ts
tafqeet(100000, { locale: 'hi' }); // "एक लाख" (لاك)
tafqeet(2000, { locale: 'ru' }); // "две тысячи"
tafqeet(71, { locale: 'fr' }); // "soixante et onze"
tafqeet(-5, { locale: 'fa' }); // "منفی پنج"
```

## الواجهة | API

```ts
tafqeet(input: number | string | bigint, options?: TafqeetOptions): string
```

| الخيار | الافتراضي | المعنى |
|---|---|---|
| `locale` | `'ar'` | `'ar' \| 'hi' \| 'fr' \| 'fa' \| 'ru'` |
| `feminine` | `false` | صيغ المؤنث حيث تُدعم (ar: `واحدة/اثنتان`، fr: `une`، ru: `одна/две`) |
| `decimalSeparator` | `'فاصلة'` | الكلمة الفاصلة بين الصحيح والكسر |
| `negativePrefix` | `'سالب'` | بادئة الأعداد السالبة |

### قواعد الإدخال

- `number` أو نص رقمي `string` أو `bigint`.
- تُقبل الأرقام العربية والمشرقية: `tafqeet('١٢٣')`.
- تُتجاهل فواصل التجميع: `tafqeet('1,000')` ← `"ألف"`.
- الكسور تُنطق رقماً رقماً مع حفظ الأصفار: `tafqeet('1.05')` ←
  `"واحد فاصلة صفر خمسة"`.
- الحد: الجزء الصحيح حتى **18 خانة** (حتى كوينتيليون). الأكبر يرمي `RangeError`
  وغير الصالح يرمي `TypeError`.

## أمثلة | Examples

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

## آلية العمل | How it works

1. **توحيد** (`parseInput`): تحويل الأرقام العربية/المشرقية إلى لاتينية، وحذف
   فواصل التجميع (`, ، مسافة _ '`)، وفصل الإشارة والصحيح والكسر، والتحقق من
   الشكل وحد الـ 18 خانة.
2. **تقسيم** الصحيح إلى مجموعات ثلاثية من اليمين، كل مجموعة لها رتبة:
   `ألف، مليون، مليار، تريليون، كوادريليون، كوينتيليون`.
3. **إعراب** كل مجموعة: `1` ← مفرد (`ألف`)، `2` ← مثنى (`ألفان`)، `3–10` ←
   جمع (`آلاف`)، `11+` ← مفرد (`ألف`).
4. **نطق** المجموعات تحت الألف بجدول المئات
   (`مائة، مائتان، ثلاثمائة ... تسعمائة`) والعشرات بالترتيب الصحيح
   (`واحد وعشرون` لا `عشرون واحد`).
5. **ربط** الأجزاء بـ `و`، ثم الكسر رقماً رقماً بعد `فاصلة`، والسوالب
   ببادئة `سالب`.

## التطوير | Development

```bash
npm install
npm run build   # tsc ← dist/cjs + dist/esm + dist/umd ‏(اعتمادية تطوير واحدة: typescript)
npm test        # بناء + node --test ‏(بدون إطار اختبار)
```

بنية المشروع (انظر النسخة الإنجليزية [README.md](./README.md) للتفاصيل):

```
src/index.ts          # الموزع + توحيد الإدخال (locale: ar/hi/fr/fa/ru)
src/types.ts          # ‏Locale وTafqeetOptions وNumericInput
src/locales/ar.ts     # العربية (افتراضي)
src/locales/hi.ts     # الهندية (النظام الهندي)
src/locales/fr.ts     # الفرنسية (المقياس الطويل)
src/locales/fa.ts     # الفارسية
src/locales/ru.ts     # الروسية (إعراب)
test/numbers.test.mjs # ‏85 حالة بمنفذ اختبار Node المدمج
scripts/build.mjs     # ‏tsc + حزمة UMD عبر esbuild
```

## الرخصة | License

MIT — انظر [LICENSE](./LICENSE). ‏(English terms in [README.md](./README.md).)
