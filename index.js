/* eslint-disable eqeqeq */

const a = ['', 'واحد ', 'اثنين ', 'ثلاث ', 'اربعه ',
    'خمسه ', 'سته ', 'سبعه ', 'ثمانية ', 'تسعه ', 'عشره ', 'احده عشر ', 'اثناعشر ', 'ثلاثه عشر ', 'اربعة عشر ', 'خمسة عشر ', 'سته عشر ',
    'سبعة عشر ', 'ثمانية عشر ', 'تسعة عشر '
]
const b = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

const getLT20 = (n) => a[Number(n)]
const getGT20 = (n) => b[n[0]] + ' ' + a[n[1]]

module.exports = function numWords(input) {
    const num = Number(input)
    if (isNaN(num)) return ''
    if (num === 0) return 'صفر'

    const numStr = num.toString()
    if (numStr.length > 9) {
        throw new Error('overflow') // Does not support converting more than 9 digits yet
    }

    const [, n1, n2, n3, n4, n5] = ('000000000' + numStr).substr(-9).match(regex) // left pad zeros

    let str = ''
    str += n1 != 0 ? (getLT20(n1) || getGT20(n1)) + 'مليار ' : ''
    str += n2 != 0 ? (getLT20(n2) || getGT20(n2)) + 'مليون ' : ''
    str += n3 != 0 ? (getLT20(n3) || getGT20(n3)) + 'الف ' : ''
    str += n4 != 0 ? getLT20(n4) + 'مائة ' : ''
    str += n5 != 0 && str != '' ? 'و ' : ''
    str += n5 != 0 ? (getLT20(n5) || getGT20(n5)) : ''

    return str.trim()
}