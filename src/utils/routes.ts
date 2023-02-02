/** @format */
/**
 * 内部小程序的路由跳转都需要在这个文件注册，然后导出，不能把路径硬编码在业务。
 */
import Taro from '@tarojs/taro'

function createParams(params: object) {
    return Object.keys(params)
        .map(key => `${key}=${params[key] || ''}`)
        .join('&')
}

export interface MessageNew {
    id?: number
}

export interface MessageDetail {
    id: number
}

export interface TypeInManual {
    orderId: string
    zhahao: string
    jp_number?: string
    name?: string
}

export interface ProductDetail {
    orderId: number
}

export interface TypeInEdit {
    orderNum: string
    processId: string
    zhahao: string
}

export interface TypeInBatch {
    orderNum: string
    processId: number
}

/**
 * 统一命名： 模块 + 页面名称；由下划线连接，统一小写。
 * 如：管理端下钻页面 ：admin_port_sales_list
 */
export enum Pages {
    // 辅助设置
    pages_pkg_setting_index = '/pages/pkg-setting/index',
    // 消息通知
    pages_pkg_message_notice = '/pages/pkg-message/notice',
    // 消息详情
    pages_pkg_message_detail = '/pages/pkg-message/detail',
    // 消息发布
    pages_pkg_message_index = '/pages/pkg-message/index',
    // 新建消息
    pages_pkg_message_new = '/pages/pkg-message/new',
    // 手工录菲
    pages_pkg_type_in_manual = '/pages/pkg-type-in/manual',
    // 批量领菲
    pages_pkg_type_in_batch = '/pages/pkg-type-in/batch',
    // 工菲修改
    pages_pkg_type_in_edit = '/pages/pkg-type-in/edit',
    // 工作查询
    pages_pkg_job_query = '/pages/pkg-job/query',
    // 数据图表
    pages_pkg_data_chart_product = '/pages/pkg-data-chart/product',
    // 生产进度
    pages_pkg_product_progress = '/pages/pkg-product/progress',
    // 生产详情
    pages_pkg_product_detail = '/pages/pkg-product/detail',
}

/**
 * 参数映射
 */
interface RouteQueryMap {
    [key: string]: object
    [Pages.pages_pkg_message_new]: MessageNew
    [Pages.pages_pkg_message_detail]: MessageDetail
    [Pages.pages_pkg_type_in_manual]: TypeInManual
    [Pages.pages_pkg_product_detail]: ProductDetail
    [Pages.pages_pkg_type_in_edit]: TypeInEdit
    [Pages.pages_pkg_type_in_batch]: TypeInBatch
}

/**
 * 页面路由跳转 例子: goRoute(Pages.pages_pkg_setting_index, params)
 * @param name
 * @param params
 */
export const goRoute = <K extends Pages>(
    name: K,
    params?: RouteQueryMap[K],
    type: 'navgateTo' | 'redirectTo' | 'reLaunch' = 'navgateTo',
) => {
    let url: string = name
    if (params) {
        url += '?' + createParams(params)
    }
    switch (type) {
        case 'navgateTo':
            Taro.navigateTo({url})
            break
        case 'redirectTo':
            Taro.redirectTo({url})
            break
        case 'reLaunch':
            Taro.reLaunch({url})
            break
    }
}
