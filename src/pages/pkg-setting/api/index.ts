/** @format */
import request from '@/src/network/index'
import {API} from '@/src/types/index'

/**
 * 员工设置
 * @param params
 * @returns
 */
export function postSetting(params: API.Setting.Setup.Params) {
    return request.post<{}>(`/indexApi/setup`, params)
}
