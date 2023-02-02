/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.Common.FileUpload {
        export interface Data {
            file: string //文件地址
            hash: string
            data_id: number
            type: number //类型，1内部，2系统
            size: number
            group: string
            upfileName: string
            ctime: number
            thumb: string[]
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.Common.FactoryList {
        export interface Data {
            id: number | string //工厂id
            name: string //工厂名称
        }
        export type Response = Types.Response.All<Data[]>
    }

    export namespace API.Common.GroupList {
        export interface Params {
            factoryId: string //工厂id
        }
        export interface Data {
            id: number | string //小组id
            name: string //小组名称 '板桥米莫一厂/梭织四组'
        }
        export type Response = Types.Response.All<Data[]>
    }
}
