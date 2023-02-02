/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import request from '@/src/network/index'

interface State {
    data: API.Common.GroupList.Data[]
    onLoad: () => Promise<API.Common.GroupList.Response>
    clear: () => void
}

export const useGroupList = create<State>(set => ({
    data: [],
    async onLoad() {
        const res = await request.post<API.Common.GroupList.Data[]>(`/commonApi/getGroupList`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    clear() {
        set({data: []})
    },
}))
