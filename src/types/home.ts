/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.Home.Banner {
        export interface Lunbotu {
            img: string
        }
        export interface Xiaoxi {
            title: string
            create_time: string
        }
        export interface Data {
            lunbotu: Lunbotu[]
            xiaoxi: Xiaoxi[]
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.Home.EmployeeInfo {
        export interface Stat {
            //本月订单量
            month_order_count: number
            //本月总件数
            month_jianshu: string
            //今日工资
            today_salary: number
            //本月总工资
            month_salary: string
        }
        export interface EchartList {
            //x轴 '2022-11-05'
            x: string
            //数量
            total_jianshu: number
            //工资
            total_price: number
        }
        export interface Data {
            stat: Stat
            echartList: EchartList[]
        }
        export type Response = Types.Response.All<Data>
    }
}
