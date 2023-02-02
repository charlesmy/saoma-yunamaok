/** @format */
import request from '@/src/network/index'
import {API} from '@/src/types/index'

/**
 * 获取消息列表
 * @param params
 * @returns
 */
export function getList(params: API.Message.List.Params) {
    return request.post<API.Message.List.Data>(`/newsApi/page`, params)
}

/**
 * 删除消息
 * @param params
 * @returns
 */
export function delMsg(params: API.Message.Del.Params) {
    return request.post<API.Message.Del.Data>(`/newsApi/del`, params)
}

/**
 * 发布消息
 * @param params
 * @returns
 */
export function publicMsg(params: API.Message.Public.Params) {
    return request.post<API.Message.Public.Data>(`/newsApi/publish`, params)
}

/**
 * 获取消息数
 * @param params
 * @returns
 */
export function getMsgCount() {
    return request.post<API.Message.Count.Data>(`/newsApi/count`)
}

/**
 * 执行对象列表
 * @returns
 */
export function getRoleList() {
    return request.post<API.Message.RoleList.Data>(`/newsApi/roleList`)
}

/**
 * 消息详情
 * @returns
 */
export function getMsgDesc(params: API.Message.Desc.Params) {
    return request.post<API.Message.Desc.Data>(`/newsApi/detail`, params)
}

/**
 * 消息新增
 * @returns
 */
export function addMsg(params: API.Message.Add.Params) {
    return request.post<{}>(`/newsApi/add`, params)
}

/**
 * 消息修改
 * @returns
 */
export function editMsg(params: API.Message.Edit.Params) {
    return request.post<{}>(`/newsApi/update`, params)
}
