/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.TypeIn.Add {
        export interface Params {
            orderNum: string //订单编号
            zhahao: string //扎号
            quintity: string //数量
            strProcessIds: string //工序id，英文逗号分割开 '27893,27894,27895'
            jpNumber: string //待人录菲，必须传他人工号 10086
        }
        export type Response = Types.Response.All<{}>
    }

    export namespace API.TypeIn.HelpScan {
        export interface Params {
            jp_number: string //工号
            // name: string //姓名
        }
        export interface Data {
            jp_number: string //工号
            name: string //姓名
            id: number //id
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.TypeIn.Detail {
        export interface Params {
            orderNum: string //订单编号
            zhahao: string //扎号
        }
        export interface GongxuList {
            id: number //工序id
            process_name: string //工序名称
            process_name_id: string
            totalCount: number //总数
            leave: number //剩余数
        }
        export interface Data {
            id: number //订单id
            client_ordernum: string //订单号
            factory_id: number
            group_id: number
            factory_outgo_id: number
            sku: string //sku
            is_auto_import: number
            caichuang_chuanghao: number
            dress_color: string //颜色
            size_name: string //尺码
            zhahao: number //扎号
            jianshu: number //数量
            chuanghao: number //床号
            orderId: number
            cut_packages_remark: string
            factory_name: string
            group_name: string
            factory_outgo_name: string
            client: string //客户
            gongxuList: GongxuList[]
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.TypeIn.Mingxi {
        export interface Params {
            orderId: string //订单编号
            zhahao: string //扎号
        }
        export interface Data {
            process_name: string //工序
            quintity: number //领取数量
            user_name: string //领取人
            totalCount: number //总件数
            leave: number //剩余件数
            title: string //描述
        }
        export type Response = Types.Response.All<Data[]>
    }

    /**
     * 工菲修改
     */
    export namespace API.TypeIn.GetProcessList {
        export interface Params {
            orderNum: string //订单编号
        }
        export interface Data {
            id: number //工序id
            process_name: string //工序名
        }
        export type Response = Types.Response.All<Data[]>
    }

    export namespace API.TypeIn.ProcessDetail {
        export interface Params {
            orderNum: string
            processId: string
            zhahao: string
        }

        export interface UserProcessList {
            id: string
            bar_num: number
            user_name: string
            create_time: number
            quintity: number //数量
            size_name: string
        }

        export interface Order {
            id: number //消息id
            sku: string
            client_ordernum: string
            zhahao: string //扎号
            process_name: string
        }
        export interface Data {
            userProcessList: UserProcessList[]
            order: Order
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.TypeIn.UserProcessDel {
        export interface Params {
            userProcessIds: string //用户扫菲的记录id
        }
        export type Response = Types.Response.All<{}>
    }

    export namespace API.TypeIn.Adjustment {
        export interface Params {
            userProcessId: string
            jpNumber: string
        }
        export type Response = Types.Response.All<{}>
    }

    export namespace API.TypeIn.UserProcessUpdate {
        export interface Params {
            orderId: string //订单id
            userProcessId: string //用户扫菲的记录id
            jianshu: string //数量
        }
        export type Response = Types.Response.All<{}>
    }

    /**
     *
     */
    export namespace API.TypeIn.AdjustmentToUserList {
        export interface Data {
            name: string //姓名
            jp_number: string //工号
        }
        export type Response = Types.Response.All<Data[]>
    }

    /**
     * 批量扫菲录入
     */
    export namespace API.TypeIn.BatchScanAdd {
        export interface Params {
            orderNum: string //订单号
            processId: number //工序id
            // zhahaoStrs: string //扎号集合
            // quintity: string //领菲数量
            params: {zhahao: number; quintity: number}[]
        }
        export type Response = Types.Response.All<{}>
    }
    /**
     * 批量扫菲详情
     */
    export namespace API.TypeIn.BatchScanDetail {
        export interface Params {
            orderNum: string //订单号
            processId: number //工序id
        }

        export interface GongxuList {
            zhahao: number //扎号
            totalCount: number //总数
            size_name: string //尺码
            leave: number //已领取
        }
        export interface Data {
            id: number
            client_ordernum: string //订单号
            process_name: string
            sku: string //sku
            factory_id: number
            group_id: number
            factory_outgo_id: number
            is_auto_import: number
            caichuang_chuanghao: number
            dress_color: string
            size_name: string
            jianshu: number
            chuanghao: number
            zhahao: string //扎号
            orderId: string
            sizeList: string[] //size集合
            gongxuList: GongxuList[]
        }
        export type Response = Types.Response.All<Data>
    }
}
