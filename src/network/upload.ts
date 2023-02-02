/** @format */
import Taro from '@tarojs/taro'
import {getSessionToken} from '@/src/utils/token-helper'
import {getConfig} from '@/src/config'
import {API} from '@/src/types'
import {Types} from '@/src/types/response'
import {LogUtil} from '../utils/logger'

const appConfig = getConfig()

export function createUploadOptions(options: Taro.uploadFile.Option): Taro.uploadFile.Option {
    const url = String(options.url || '')
    const path = /^http(s?):\/\//.test(url) ? url : `${appConfig.BASE_API + url}`
    const reqOptions: Taro.uploadFile.Option = {
        ...options,
        url: path,
        /** 要上传文件资源的路径 */
        filePath: options.filePath,
        /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
        name: options.name,
        formData: options.formData || {},
        header: {
            ...options.header,
            'content-type': 'multipart/form-data',
            authSession: getSessionToken(),
            'x-app-type': 'mimo',
            'x-app-env': 'prd',
            'x-app-version': '1.0',
        },
    }
    return reqOptions
}

export function getResponse<D = string>(resp: Taro.uploadFile.SuccessCallbackResult): Types.Response.All<D> {
    const errRes = {code: resp.statusCode, message: resp.errMsg || '未知异常'} as Types.Response.Error<D>
    try {
        const data = JSON.parse(resp.data)
        if (data.code === 200) {
            const okResponse: Types.Response.Success<D> = {
                code: 0,
                data: data?.data as D,
                message: data?.msg,
            }
            return okResponse
        }
        LogUtil.error('upload fail =========', JSON.stringify(resp))
        return {code: data.code || errRes.code, message: data.message || errRes.message}
    } catch (e) {
        return errRes
    }
}

/**
 * 上传文件
 * @param filePath
 * @returns
 */
export function uploadFile(filePath: string) {
    const option = createUploadOptions({
        url: '/commonApi/upload',
        filePath: filePath,
        name: 'file',
        formData: {full_path: true},
    })
    return new Promise<Types.Response.All<API.Common.FileUpload.Data> | null>(resolve => {
        Taro.uploadFile({
            ...option,
            success: data => {
                const res = getResponse<API.Common.FileUpload.Data>(data)
                resolve(res)
            },
            fail: err => {
                LogUtil.error('upload file err =========', JSON.stringify(err))
                resolve(null)
            },
        })
    })
}
