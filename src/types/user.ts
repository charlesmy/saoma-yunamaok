/** @format */
/* eslint-disable import/export */
import {Types} from './response'

declare module '@/src/types/index' {
    export namespace API.User.Info {
        export interface Data {
            // //微信名
            nickname: string
            sex: number
            province: string
            city: string
            country: string
            /**
             * 头像
             */
            headimgurl: string
            admin_id: number
            realname: string
            id: number
            //员工名
            name: string
            //工厂id
            factory_id: number
            //部门id
            depart_id: number
            //分组id
            group_id: number
            status: number
            number: number
            //员工工号
            jp_number: string
            worktype: string
            create_time: number
            update_time: null
            system_user_id: number
            //用户id
            user_id: number
            //记住上次工序选择，0不记住，1记住
            remeber_process_bool: 0 | 1
            //绑定工序后自动提交，0不是，1是
            bind_process_commit_bool: 0 | 1
            //批量领菲，0不是，1是
            batch_scan_bool: 0 | 1
            //关闭品质录入，0不是，1是
            close_quality_bool: 0 | 1
            //品质录入数量
            quality_num: number
            //可返修，0不是，1是
            fix_bool: 0 | 1
            //疵品，0不是，1是
            bad_bool: 0 | 1
            //工资详情为首页，0不是，1是
            salary_bool: 0 | 1
            //工厂名
            factory_name: string
            //部门
            depart_name: string
            //小组
            group_name: string
            //员工角色 例子: '[员工]'
            role: string
            manage: number // 0员工，1管理员。
            bind_process_ids: string //绑定工序id集合
            bind_process_str: string //绑定工序
        }
        export type Response = Types.Response.All<Data>
    }
}
