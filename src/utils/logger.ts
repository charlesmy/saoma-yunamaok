/** @format */

import Taro from '@tarojs/taro'

const logger = Taro.getRealtimeLogManager?.()

export class LogUtil {
    public static error(..._args) {
        if (!logger) return
        logger.error.apply(logger, arguments)
    }

    public static info(..._args) {
        if (!logger) return
        logger.info.apply(logger, arguments)
    }
}
