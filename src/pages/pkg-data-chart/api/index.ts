/** @format */

import request from '@/src/network/index'
import {API} from '@/src/types/index'

/**
 * 获取订单数据
 * @param params
 * @returns
 */
export function getOrder(params: API.DataChart.Order.Params) {
    return request.post<API.DataChart.Order.Data[]>(`/ChartApi/order`, params)
}

/**
 * 获取生产数据
 * @param params
 * @returns
 */
export function getProduct(params: API.DataChart.Produce.Params) {
    return request.post<API.DataChart.Produce.Data[]>(`/ChartApi/produce`, params)
}

/**
 * 获取工资数据
 * @param params
 * @returns
 */
export function getSalary(params: API.DataChart.Salary.Params) {
    return request.post<API.DataChart.Salary.Data[]>(`/chartApi/salary`, params)
}

/**
 * 获取组
 * @returns
 */
export function getGroups(params: API.Common.GroupList.Params) {
    return request.post<API.Common.GroupList.Data[]>(`/commonApi/getGroupList`, params)
}
