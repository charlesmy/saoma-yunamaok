/** @format */
// import {API} from 'ba-assistant/src/types/index'
import create from 'zustand'
import request from '@/src/network'
import Taro from '@tarojs/taro'
import {isNull} from '@/src/utils/index'
import {API} from '@/src/types/index'

/**
 * 其他地方不要也不允许直接使用这个值，获取用户信息请使用getSigin方法
 */
const StorageUserKey = 'mimo_profile'

type UserInfo = API.User.Info.Data

interface State {
    response: any | null
    user: UserInfo
    isLoading: boolean
    getUser: (cache?: boolean) => Promise<any>
    getUserFromCache: () => Promise<UserInfo>
    setUser: (user: UserInfo) => void
}

let reqList: Function[] = []

export const useUser = create<State>((set, get) => ({
    response: null,
    isLoading: false,
    isError: false,
    user: {} as any as UserInfo,
    getUser: async (cache = true) => {
        const resp = get().response
        if (cache && resp?.code === 0) {
            return resp
        }
        if (get().isLoading) {
            return new Promise(resolve => {
                reqList.push(resolve)
            })
        }
        set({isLoading: true})
        const res = await request.post<UserInfo>(`/taskApi/userInfo`, {})
        if (res.code === 0) {
            Taro.setStorageSync(StorageUserKey, res.data)
            set({user: {...get().user, ...res.data}})
        }
        set({isLoading: false, response: res})
        reqList.forEach(fn => fn(res))
        reqList = []
        return res
    },
    getUserFromCache: async () => {
        const current = get().user
        if (!isNull(current.id + '')) return current

        const res = await get().getUser()
        if (res.code === 0) return {...current, ...res.data}

        const storage = Taro.getStorageSync<UserInfo | null>(StorageUserKey)
        return {...current, ...storage}
    },
    setUser: (user: UserInfo) => {
        const cur = {...get().user, ...user}
        set({user: cur, response: {code: 0, data: cur, message: ''}})
    },
}))
