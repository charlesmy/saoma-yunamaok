/** @format */
/**
 * 时间转换
 * @params {String | Number} 时间字符串或者时间戳
 */
export function fmtTimeBucket(time: string | number) {
    // 拿到当前的时间戳（毫秒) -- 转换为秒
    const currentTime = new Date()
    const currentTimestamp = Math.floor(currentTime.getTime() / 1000)
    // 传进来的时间戳（毫秒)
    const t = new Date(time)
    const oldTimestamp = Math.floor(t.getTime() / 1000)
    // 年
    const oldY = t.getFullYear()
    // 月
    const oldM = t.getMonth() + 1
    // 日
    const oldD = t.getDate()
    // 时
    const oldH = t.getHours()
    // 分
    const oldi = t.getMinutes()
    // 秒
    // let olds = t.getSeconds()

    // 补0
    function zeroize(num) {
        return num < 10 ? '0' + num : num
    }
    // 相隔多少秒
    const timestampDiff = currentTimestamp - oldTimestamp
    if (timestampDiff < 60) {
        // 一分钟以内
        return '刚刚'
    }
    if (timestampDiff < 60 * 60) {
        // 一小时以内
        return Math.floor(timestampDiff / 60) + '分钟前'
    }
    // 今天的时间
    if (oldY === currentTime.getFullYear() && oldM === currentTime.getMonth() + 1 && oldD === currentTime.getDate()) {
        // 10:22
        return `${zeroize(oldH)}:${zeroize(oldi)}`
    }
    // 剩下的，就是昨天及以前的数据
    return `${oldY}-${zeroize(oldM)}-${zeroize(oldD)}`
}
