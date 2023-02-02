/** @format */
import Taro from '@tarojs/taro'

export function getScanResult() {
    return new Promise<Taro.scanCode.SuccessCallbackResult | null>(resolve => {
        Taro.scanCode({
            success(result) {
                resolve(result)
            },
            fail() {
                resolve(null)
            },
        })
    })
}
