/** @format */
export interface AppConfig {
    RUN_ENV: 'prod' | 'uat' | 'dev'
    BASE_API: string
}

export const options: AppConfig = require(`./config.${APP_BUILD_ENV || 'production'}.json`)

/**
 * 获取配置统一对外接口
 * @returns
 */
export const getConfig = () => {
    return options
}
