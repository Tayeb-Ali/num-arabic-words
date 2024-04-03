# num-words

An simple module to convert numbers to words for Arabic numbering system. e.g. الف و المليون و المليار

# Install

```js
npm i num-arabic-words
```

# Example

```js
1          ->  واحد
12         ->  اثني عشر
123        ->  مئة وثلاث وعشرون
1234       ->  ألف و ومئتان و اربع وثلاثون
12345      ->  اثنا عشر ألفاً  وثلاثمائة و خمس واربعين
```

# Usage

```js
const numWords = require('num-arabic-words')

const amountInWords = numWords(12345) // اثنا عشر ألفاً  وثلاثمائة و خمس واربعين
```
## TypeScript:
```ts
import {numWords} from num-arabic-words;

const amountInWords = numWords(12345); // اثنا عشر ألفاً  وثلاثمائة و خمس واربعين
```

_Note: This module only supports 9 digits input. A typical usecase for such convertion is in tax invoices or charts etc. For that more than 9 digits input is not very common (and also not very readable)._

# Contributing

In case you notice a bug, please open an issue mentioning the input that has caused an incorrect conversion.
