/** @format */
import Taro from '@tarojs/taro'
import {Types} from '@/src/types/response'
import {LogUtil} from '@/src/utils/logger'
import {getConfig, AppConfig} from '@/src/config/index'
import {filterNullValue} from '@/src/utils/index'
import {getSessionToken} from '@/src/utils/token-helper'

const config = getConfig()

const StatusCodeMap: {[key: number]: string} = {
    400: '参数错误',
    401: '鉴权不通过',
    403: '禁止访问',
    404: '找不到资源',
    405: 'Method Not Allowed',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
}

const requestInterceptor = (chain: Taro.Chain) => {
    const requestParams = chain.requestParams
    const {url, method} = requestParams
    const start = Date.now()
    return chain
        .proceed(requestParams)
        .then(res => {
            const end = Date.now()
            if (res.statusCode !== 200) {
                const ex = res.data && res.data.exception
                if (ex && ex.length > 100) {
                    res.data.exception = ex.slice(0, 100)
                }
                LogUtil.error(`http --> ${url} [${method}] ${res.statusCode} ${end - start}
                --> params: ${JSON.stringify(requestParams.data)}
                --> response: ${JSON.stringify(res)}`)
            }
            return res
        })
        .catch(e => {
            LogUtil.error(`http --> ${url} [${method}] err ${JSON.stringify(e)}`)
        })
}

Taro.addInterceptor(requestInterceptor)

export function createRequestOptions(options: Taro.request.Option) {
    const path = /^http(s?):\/\//.test(options.url) ? options.url : `${config.BASE_API}${options.url}`
    const data = filterNullValue(options.data)
    const reqOptions: Taro.request.Option = {
        ...options,
        data,
        url: path,
        method: options.method || 'GET',
        header: {
            ...options.header,
            'content-type': 'application/json',
            authSession: getSessionToken(),
            'x-app-type': 'mimo',
            'x-app-env': 'prd',
            'x-app-version': '1.0',
        },
        cache: 'no-cache',
        timeout: options.timeout || 10000,
    }
    return reqOptions
}

export type RequestOptions = Taro.request.Option

export class Http {
    public config: AppConfig
    public constructor() {
        this.config = config
    }

    protected async request<D>(options: RequestOptions) {
        try {
            const reqOptions = createRequestOptions(options)
            const result = await Taro.request(reqOptions)
            return this.createResponse<D>(result)
        } catch (e) {
            const errResponse: Types.Response.Error<D> = {
                code: -1,
                data: undefined,
                message: e.errMsg || '请求失败',
            }
            return errResponse
        }
    }

    public createResponse<D>(result: Taro.request.SuccessCallbackResult): Types.Response.All<D> {
        if (result?.data?.code === 200) {
            const okResponse: Types.Response.Success<D> = {
                code: 0,
                data: result?.data?.data as D,
                message: result?.data?.msg,
            }
            return okResponse
        }
        const msg = (result?.data && result.data?.msg) || StatusCodeMap[result?.statusCode] || '未知错误'
        const errResponse: Types.Response.Error<D> = {
            code: (result?.statusCode || result?.data?.code) as Types.Response.Code,
            data: undefined,
            message: msg,
        }
        return errResponse
    }
}
