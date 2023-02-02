/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import request from '@/src/network/index'

interface State {
    data: API.Message.RoleList.Data[]
    onLoad: () => Promise<API.Message.RoleList.Response>
    clear: () => void
}

export const useRoleList = create<State>(set => ({
    data: [],
    async onLoad() {
        const res = await request.post<API.Message.RoleList.Data[]>(`/newsApi/roleList`)
        if (res.code === 0) {
            set({data: res.data || []})
        }
        return res
    },
    clear() {
        set({data: []})
    },
}))
