/** @format */
import request from '@/src/network'
import {API} from '@/src/types/index'

/**
 * 获取列表
 * @param params
 * @returns
 */
export function getList(params: API.Product.List.Params) {
    return request.post<API.Product.List.Data>(`/orderApi/page`, params)
}

/**
 * 获取统计
 * @param params
 * @returns
 */
export function getStat(params: API.Product.Stat.Params) {
    return request.post<API.Product.Stat.Data>(`/orderApi/stat`, params)
}

/**
 * 获取详情
 * @param params
 * @returns
 */
export function getDetail(params: API.Product.Desc.Params) {
    return request.post<API.Product.Desc.Data>(`/orderApi/detail`, params)
}

/**
 * 获取弹窗数据
 * @param params
 * @returns
 */
export function getFinishDetail(params: API.Product.Popup.Params) {
    return request.post<API.Product.Popup.Data[]>(`/orderApi/finishDetail`, params)
}

/**
 * 工厂列表
 * @returns
 */
export function getFactoryList() {
    return request.post<API.Common.FactoryList.Data[]>(`/orderApi/getFactoryList`)
}
