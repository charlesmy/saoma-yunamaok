/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.Setting.SetupDetail {
        export interface Data {
            id: number
            user_id: number //wx_user表主键id
            remeber_process_bool: number //记住上次工序选择，0不记住，1记住
            bind_process_commit_bool: number //绑定工序后自动提交，0不是，1是
            batch_scan_bool: number //批量领菲，0不是，1是
            close_quality_bool: number //关闭品质录入，0不是，1是
            quality_num: number //品质录入数量
            fix_bool: number //可返修，0不是，1是
            bad_bool: number //疵品，0不是，1是
            salary_bool: number //工资详情为首页，0不是，1是
            update_time: string
        }
        export type Response = Types.Response.All<Data>
    }

    export namespace API.Setting.Setup {
        export interface Params {
            remeber_process_bool?: number //记住上次工序选择，0不记住，1记住
            bind_process_commit_bool?: number //绑定工序后自动提交，0不是，1是
            batch_scan_bool?: number //批量领菲，0不是，1是
            close_quality_bool?: number //关闭品质录入，0不是，1是
            quality_num?: number //品质录入数量
            fix_bool?: number //可返修，0不是，1是
            bad_bool?: number //疵品，0不是，1是
            salary_bool?: number //工资详情为首页，0不是，1是
        }
        export type Response = Types.Response.All<{}>
    }
}
