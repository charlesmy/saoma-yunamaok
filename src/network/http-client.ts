/** @format */

import Taro from '@tarojs/taro'
import {Types} from '@/src/types/response'
import {LogUtil} from '@/src/utils/logger'
import {getSessionToken, setSessionToken} from '@/src/utils/token-helper'
import {createRequestOptions, Http} from './http-base'

/**
 * @description 获取微信code
 * @returns
 */
export const getWxCode = () => {
    return new Promise<string>(resolve => {
        Taro.login({
            success: res => {
                resolve(res.code)
            },
            fail: err => {
                LogUtil.error('login fail =====>: ' + JSON.stringify(err))
                resolve('')
            },
        })
    })
}

export async function reauth(): Promise<Types.Response.All<{}>> {
    const wxCode = await getWxCode()
    if (!wxCode) {
        console.log('get code err: ', wxCode)
        LogUtil.error(`获取code失败: wxCode: ${wxCode}`)
        return {code: -1000, message: '认证失败'}
    }
    const res = await Taro.request(
        createRequestOptions({
            url: '/taskApi/autoLogin',
            method: 'POST',
            data: {
                code: wxCode,
            },
        }),
    )
    if (res?.statusCode === 200 && res.data?.data?.authSession) {
        setSessionToken(res.data.data.authSession)
        return {code: 0, message: '', data: res.data.data}
    }
    LogUtil.error(`认证请求出错: /taskApi/autoLogin , err: ${JSON.stringify(res || '').slice(0, 400)}`)
    return {code: -1000, message: res?.errMsg || '未知错误'}
}

type RequestConfig = Taro.request.Option

export class HttpClient extends Http {
    private requestArr: Function[] = []

    private async reload() {
        const res = await reauth()
        this.requestArr.forEach(fn => fn())
        this.requestArr = []
        return res
    }

    public async fetch<D>(config: RequestConfig): Promise<Types.Response.All<D>> {
        if (!getSessionToken()) {
            return this.retry(config)
        }
        const result = await this.request<D>(config)
        if (result.code === 403) {
            return this.retry(config)
        }
        return result
    }

    private retry<D>(options: RequestConfig): Promise<Types.Response.All<D>> {
        return new Promise<Types.Response.All<D>>(resolve => {
            this.requestArr.push(() => {
                resolve(this.request<D>(options))
            })
            if (this.requestArr.length <= 1) {
                this.reload()
            }
        })
    }

    public async get<D>(url: string, data?: object, config?: Partial<RequestConfig>): Promise<Types.Response.All<D>> {
        return this.fetch<D>({...config, url, data, method: 'GET'})
    }

    public async post<D>(url: string, data?: object, config?: Partial<RequestConfig>): Promise<Types.Response.All<D>> {
        return this.fetch<D>({...config, url, data, method: 'POST'})
    }

    public async put<D>(url: string, data?: object, config?: Partial<RequestConfig>): Promise<Types.Response.All<D>> {
        return this.fetch<D>({...config, url, data, method: 'PUT'})
    }

    public async delete<D>(
        url: string,
        data?: object,
        config?: Partial<RequestConfig>,
    ): Promise<Types.Response.All<D>> {
        return this.fetch<D>({...config, url, data, method: 'DELETE'})
    }
}
