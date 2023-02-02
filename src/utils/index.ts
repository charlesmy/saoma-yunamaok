/**
 * 过滤对象空值
 *
 * @format
 * @param {*} obj
 * @returns 无空值的新对象
 */

export function filterNullValue(obj = {}) {
    return Object.keys(obj).reduce((pre, cur) => {
        const value = obj[cur]
        if (!isNull(value)) pre[cur] = value
        return pre
    }, {})
}

/**
 * 判断字符串是否为空, 空格也算为空
 * @param str
 * @returns
 */
export function isNull(str: string = '') {
    if (str === null || str === undefined) return true
    const res = String(str).replace(/(^\s*)|(\s*$)/g, '')
    return !res
}

/**
 * 把url中的search转成object
 * @param param url
 */
export const query2Object = (param: string | Location) => {
    const pattern = /([^?&=]+)=([^&#]*)/g
    const dict: {[key: string]: string} = {}
    let search = ''
    if (typeof param === 'object' && param instanceof Location) {
        search = param.search
    } else if (typeof param === 'string') {
        search = param
    } else {
        throw new Error('参数类型非法！请传入window.loaction对象或者url字符串。')
    }
    search.replace(pattern, function (rs, $1, $2) {
        const key = decodeURIComponent($1)
        const value = decodeURIComponent($2)
        dict[key] = value
        return rs
    })
    return dict
}

export function debounce(fn: Function, delay: number, scoped?: object): Function {
    let timer
    return function () {
        const _this = scoped || this
        const args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            fn.apply(_this, args)
        }, delay)
    }
}

export function throttle(func: Function, delay: number): Function {
    let prev = Date.now()
    return function () {
        const context = this
        const args = arguments
        const now = Date.now()
        if (now - prev >= delay) {
            func.apply(context, args)
            prev = Date.now()
        }
    }
}
