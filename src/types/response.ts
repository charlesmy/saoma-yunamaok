/**
 * /* eslint-disable @typescript-eslint/no-namespace
 *
 * @format
 */

export namespace Types {
    /**
     * 请求的响应体
     */
    export declare namespace Response {
        export type Code =
            // 认证出错
            | -1000
            // 请求失败
            | -1
            // 找不到服务
            | 404
            // 未认证
            | 401
            | 403
            // 服务器错误
            | 500
            | 501
        export interface Success<D> {
            /**
             * 当前的请求码
             */
            code: 0
            /**
             * 当前请求的消息提示
             */
            message: string
            /**
             * 当前请求返回的数据
             */
            data: D
        }
        export interface Error<D> {
            /**
             * 当前的请求码
             */
            code: Code
            /**
             * 当前请求的消息提示
             */
            message: string
            /**
             * 当前请求返回的数据
             */
            data?: D
        }
        export type All<D> = Success<D> | Error<D>
    }
}
