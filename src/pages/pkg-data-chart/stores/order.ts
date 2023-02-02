/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import {getOrder} from '../api'

interface State {
    data: API.DataChart.Order.Data[]
    getData: (params: API.DataChart.Order.Params) => Promise<API.DataChart.Order.Response>
    clear: () => void
}

export const useOrder = create<State>(set => ({
    data: [],
    async getData(params: API.DataChart.Order.Params) {
        const res = await getOrder(params)
        if (res.code === 0) {
            set({data: res.data || []})
        } else {
            set({data: []})
        }
        return res
    },
    clear() {
        set({data: []})
    },
}))
