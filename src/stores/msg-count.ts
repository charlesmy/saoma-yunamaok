/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import request from '@/src/network/index'

interface State {
    data: null | API.Message.Count.Data
    onLoad: () => Promise<API.Message.Count.Response>
    clear: () => void
}

export const useMsgCount = create<State>(set => ({
    data: null,
    async onLoad() {
        const res = await request.post<API.Message.Count.Data>(`/newsApi/count`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    clear() {
        set({data: null})
    },
}))
