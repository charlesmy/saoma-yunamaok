/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.Product.Common {
        export interface Params {
            orderNum: string //选填，订单编号
            timeType: string //选填，时间类型,1完成时间，2下单时间，3裁床时间
            beginTime: string //选填，开始时间，例子：2022-11-08 01:01:01
            endTime: string //选填，结束时间
            factoryId: string //选填，工厂id
            status: string //选填，状态,0未开始，1车缝生产中，2车缝完成，3后整生产中，4后整完成
        }
    }

    /**
     * 生产统计
     */
    export namespace API.Product.Stat {
        export type Params = API.Product.Common.Params

        export interface Data {
            order_count: number //订单
            order_jianshu: number //下单
            chejian_count: string //车间
            caichuang_count: string //裁床
            tail_count: string //尾部
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 生产列表
     */
    export namespace API.Product.List {
        export interface Params extends API.Product.Common.Params {
            page: number
            limit: number
        }

        export interface Item {
            order_id: number //订单id
            create_time: string //最后扫菲时间
            caichuang_over_time: string
            client_ordernum: string //订单号
            quantity: number
            delivery_time: number
            caichuang_count: string
            name: string //姓名
            pic: string //图片
            scan_finish_time: string // '2022-10-13 16:48:10'
            scan_finish_count: number // 100
            percent: string // '10%'
            status_title: string // '[生产中]'
        }

        export interface Data {
            list: Item[]
            hasNext: boolean
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 生产详情
     */
    export namespace API.Product.Desc {
        export interface Params {
            orderId: number
        }
        export interface Order {
            order_id: number
            create_time: string
            caichuang_over_time: string
            sku: string
            client_ordernum: string
            quantity: number
            delivery_time: number
            caichuang_count: string
            name: string
            pic: string
        }
        export interface ProcessItem {
            process_id: number
            process_name: string
            finish_count: string
            userNum: number
            create_time: string
            qianshu: number
        }
        export interface Data {
            order: Order
            processList: ProcessItem[]
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 生产进度弹窗
     */
    export namespace API.Product.Popup {
        export interface Params {
            processId: number
        }
        export interface Data {
            id: number //工厂id
            zhahao: number //扎号
            user_name: string //领取人
            quintity: number //数量
            dress_color: string //颜色
            size_name: string //尺寸
        }
        export type Response = Types.Response.All<Data[]>
    }
}
