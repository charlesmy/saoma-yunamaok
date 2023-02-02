/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import request from '@/src/network/index'

interface State {
    data: API.Common.FactoryList.Data[]
    onLoad: () => Promise<API.Common.FactoryList.Response>
    clear: () => void
}

export const useFactoryList = create<State>(set => ({
    data: [],
    async onLoad() {
        const res = await request.post<API.Common.FactoryList.Data[]>(`/orderApi/getFactoryList`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    clear() {
        set({data: []})
    },
}))
