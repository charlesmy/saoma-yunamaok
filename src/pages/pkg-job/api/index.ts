/** @format */
import request from '@/src/network'
import {API} from '@/src/types/index'

/**
 * 获取列表
 * @param params
 * @returns
 */
export function getList(params: API.Job.Query.Params) {
    return request.post<API.Job.Query.Data>(`/workApi/page`, params)
}

/**
 * 获取统计
 * @param params
 * @returns
 */
export function getStat(params: API.Job.Stat.Params) {
    return request.post<API.Job.Stat.Data>(`/workApi/workStat`, params)
}

/**
 * 获取明细
 * @param params
 * @returns
 */
export function getDesc(params: API.Job.Desc.Params) {
    return request.post<API.Job.Desc.Data[]>(`/workApi/mingxi`, params)
}
