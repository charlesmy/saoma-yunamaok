/** @format */

function toThousands(num: number | string) {
    const numStr = String(num || 0)
    return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

/**
 * 使用千分符格式化数字
 * @param num
 * @param digits 小数位数
 * @returns
 */
export function formatNum(num: number | string, digits = -1) {
    if (num === null || num === undefined) return '0'
    if (Number.isNaN(Number(num))) return num + ''
    const [positive, decimal] = String(num).split('.')
    let dec = decimal
    if (digits >= 0) {
        dec = Number(`0.${decimal || 0}`)
            .toFixed(digits)
            .slice(2)
    }
    if (!dec) return toThousands(positive)
    return toThousands(positive) + '.' + dec
}
