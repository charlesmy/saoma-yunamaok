/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    /**
     * 消息分页
     */
    export namespace API.Message.List {
        export interface Params {
            page: number //页数，从1开始
            limit: number //每页条数
            type: number //类型，1内部，2系统
            status?: number //2已发布，全部就不传
        }
        export interface Item {
            id: number
            title: string
            content: string
            type: number //类型，1内部，2系统
            location: number //显示位置，1广告位，2消息提醒
            create_time: string // '2022-11-08 09:10:11'
            status: number // 发布状态：1未发布，2已发布
        }

        export interface Data {
            list: Item[]
            hasNext: boolean
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 消息数量
     */
    export namespace API.Message.Count {
        export interface Data {
            neibu: number
            system: number
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 删除消息
     */
    export namespace API.Message.Del {
        export interface Params {
            id: number
        }
        export interface Data {}
        export type Response = Types.Response.All<Data>
    }

    /**
     * 发布消息
     */
    export namespace API.Message.Public {
        export interface Params {
            id: number
        }
        export interface Data {}
        export type Response = Types.Response.All<Data>
    }

    /**
     * 消息详情
     */
    export namespace API.Message.Desc {
        export interface Params {
            id: number
        }
        export interface Data {
            id: number //消息主键id
            type: number //类型，1内部，2系统
            start_time: string //开始时间 '2022-10-29 01:00:00'
            end_time: string //结束时间 '2022-10-29 01:00:00'
            title: string //消息标题
            content: string //消息内容
            img: string //图片\文件
            location: number //显示位置，1广告位，2消息提醒
            user_id: number //创建用户id
            status: number //发布状态：1未发布，2已发布
            roles: string //执行对象 '1,2'
            create_time: string //创建时间 '2022-10-30 18:51:30'
            update_time: string //更新时间
        }
        export type Response = Types.Response.All<Data>
    }

    /**
     * 角色列表
     */
    export namespace API.Message.RoleList {
        export interface Data {
            auth: string
            ctime: number
            id: number
            intro: string
            mtime: number
            name: string
            status: number
        }
        export type Response = Types.Response.All<Data[]>
    }

    /**
     * 新增消息
     */
    export namespace API.Message.Add {
        export interface Params {
            type: number //类型，1内部，2系统
            start_time: string //开始时间
            end_time: string //结束时间
            title: string //消息标题
            content: string //消息内容
            img: string //图片\\文件
            location: number //显示位置，1广告位，2消息提醒
            roles: string //执行对象，英文逗号隔开
        }
        export type Response = Types.Response.All<{}>
    }

    /**
     * 编辑消息
     */
    export namespace API.Message.Edit {
        export interface Params {
            type: number //类型，1内部，2系统
            start_time: string //开始时间
            end_time: string //结束时间
            title: string //消息标题
            content: string //消息内容
            img: string //图片\\文件
            location: number //显示位置，1广告位，2消息提醒
            roles: string //执行对象，英文逗号隔开
            id: number //主键id
        }
        export type Response = Types.Response.All<{}>
    }
}
