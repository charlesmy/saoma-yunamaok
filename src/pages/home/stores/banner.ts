/** @format */
import create from 'zustand'
import request from '@/src/network/index'
import {API} from '@/src/types/index'

interface State {
    data: API.Home.Banner.Data
    onLoad: () => Promise<API.Home.Banner.Response>
}

export const useBanner = create<State>(set => ({
    data: {
        lunbotu: [],
        xiaoxi: [],
    },
    async onLoad() {
        const res = await request.post<API.Home.Banner.Data>(`/newsApi/indexList`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
}))
