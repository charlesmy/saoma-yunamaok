/** @format */

import Taro from '@tarojs/taro'

/**
 * 这个文件之外不要使用这个变量值
 */
const SessionToken = 'mimo_session_token'

/**
 * 设置用户登录token
 * @param token
 */
export const setSessionToken = (token: string) => {
    Taro.setStorageSync(SessionToken, token)
}

/**
 * 获取用户登录token
 * @returns
 */
export const getSessionToken = (): string => {
    try {
        return Taro.getStorageSync(SessionToken) || ''
    } catch (e) {
        return ''
    }
}
