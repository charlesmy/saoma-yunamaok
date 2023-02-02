/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    /**
     * 订单数据
     */
    export namespace API.DataChart.Order {
        export interface Params {
            orderNum: string
        }
        export interface Data {
            process_name: string //工序名称
            num: string //数量
        }
        export type Response = Types.Response.All<Data[]>
    }

    /**
     * 生产数据
     */
    export namespace API.DataChart.Produce {
        export interface Params {
            factory_id: string
        }
        export interface Data {
            x: string //工厂名称
            no_begin_val: number //未开始
            produce_val: number //生产中
        }
        export type Response = Types.Response.All<Data[]>
    }

    /**
     * 工资数据
     */
    export namespace API.DataChart.Salary {
        export interface Params {
            year: string //年份，例子：2022
            beginTime: string //开始时间
            endTime: string //结束时间
            factoryId: string //工厂id
            groupId: string
            employee: string //员工编号或姓名
        }
        export interface Data {
            x: string
            money: number
        }
        export type Response = Types.Response.All<Data[]>
    }
}
