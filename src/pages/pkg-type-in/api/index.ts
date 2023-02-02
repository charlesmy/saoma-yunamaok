/** @format */
import request from '@/src/network/index'
import {API} from '@/src/types/index'

/**
 * 扫菲详情
 * @param params
 * @returns
 */
export function getScanDetail(params: API.TypeIn.Detail.Params) {
    return request.post<API.TypeIn.Detail.Data>(`/scanApi/detail`, params)
}

/**
 * 扫菲明细
 * @param params
 * @returns
 */
export function getScanMingxi(params: API.TypeIn.Mingxi.Params) {
    return request.post<API.TypeIn.Mingxi.Data[]>(`/scanApi/mingxi`, params)
}

/**
 * 添加扫菲
 * @param params
 * @returns
 */
export function addScan(params: API.TypeIn.Add.Params) {
    return request.post<{}>(`/scanApi/add`, params)
}

/**
 * 工菲修改详情
 * @param params
 * @returns
 */
export function getProcessDetail(params: API.TypeIn.ProcessDetail.Params) {
    return request.post<API.TypeIn.ProcessDetail.Data>(`/scanApi/processDetail`, params)
}

/**
 * 工菲删除
 * @param params
 * @returns
 */
export function delProcess(params: API.TypeIn.UserProcessDel.Params) {
    return request.post<{}>(`/scanApi/userProcessDel`, params)
}

/**
 * 工菲更新
 * @param params
 * @returns
 */
export function updateProcess(params: API.TypeIn.UserProcessUpdate.Params) {
    return request.post<{}>(`/scanApi/userProcessUpdate`, params)
}

/**
 * 工菲调整
 * @param params
 * @returns
 */
export function adjustProcess(params: API.TypeIn.Adjustment.Params) {
    return request.post<{}>(`/scanApi/adjustment`, params)
}

/**
 * 小组员工列表
 * @param params
 * @returns
 */
export function getAdjustUsers() {
    return request.post<API.TypeIn.AdjustmentToUserList.Data[]>(`/scanApi/adjustmentToUserList`)
}

/**
 * 批量扫菲详情
 * @param params
 * @returns
 */
export function getBatchScanDetail(params: API.TypeIn.BatchScanDetail.Params) {
    return request.post<API.TypeIn.BatchScanDetail.Data>(`/scanApi/batchScanDetail`, params)
}

/**
 * 批量扫菲录入
 * @param params
 * @returns
 */
export function postBatchScanAdd(params: API.TypeIn.BatchScanAdd.Params) {
    return request.post<{}>(`/scanApi/batchScanAdd`, params)
}
