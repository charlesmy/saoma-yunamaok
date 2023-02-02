/** @format */
import request from '@/src/network/index'
import {API} from '@/src/types/index'

/**
 * 代人扫菲
 * @param params
 * @returns
 */
export function helpScan(params: API.TypeIn.HelpScan.Params) {
    return request.post<API.TypeIn.HelpScan.Data>(`/scanApi/helpScan`, params)
}

/**
 * 根据订单号获取工序列表
 * @param params
 * @returns
 */
export function getProcessList(params: API.TypeIn.GetProcessList.Params) {
    return request.post<API.TypeIn.GetProcessList.Data[]>(`/scanApi/getProcessList`, params)
}
