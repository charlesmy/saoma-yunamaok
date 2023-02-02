/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    /**
     * 列表分页
     */
    export namespace API.Job.Query {
        export interface Params {
            page: number //页数，从1开始
            limit: number //每页条数
            orderNumOrName: string //选填，订单编号或工序名
            beginTime: string //选填，开始时间
            endTime: string //选填，结束时间
            jpNumberOrName: string //选填，员工编号或员工姓名
        }
        export interface Item {
            order_id: string //订单id
            process_id: string //工序id
            process_name: string //工序名称
            user_name: string //员工名
            create_time: string //最后扫菲时间
            totalCount: string //数量
            totalPrice: string //总价
            totalZhashu: number //总扎数
            client_ordernum: string //订单号
            sku: string //sku
            pic: string //图片
        }
        export interface Data {
            list: Item[]
            hasNext: boolean
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 统计
     */
    export namespace API.Job.Stat {
        export interface Params {
            orderNumOrName: string //选填，订单编号或工序名
            beginTime: string //选填，开始时间
            endTime: string //选填，结束时间
            jpNumberOrName: string //选填，员工编号或员工姓名
        }
        export interface Data {
            today_price: string //当天总金额
            today_zhashu: number //当天总扎数
            today_count: string //当天总数
            month_price: string //当月总价
            month_zhashu: number //当月扎数
            month_count: string //当月总数
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 统计
     */
    export namespace API.Job.Desc {
        export interface Params {
            orderId: string //订单id
            processId: string //工序id
        }
        export interface Data {
            zhahao: number //扎号
            quintity: number //数量
            create_time: string //创建时间
            process_price: string //单价
            total_price: string //总价
            sema: string //色码
        }
        export type Response = Types.Response.All<Data[]>
    }
}
