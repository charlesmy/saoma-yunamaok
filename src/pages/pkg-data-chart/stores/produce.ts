/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import {getProduct} from '../api'

interface State {
    params: API.DataChart.Produce.Params
    data: API.DataChart.Produce.Data[]
    clear: () => void
    setParams: (params: Partial<API.DataChart.Produce.Params>) => void
    getData: () => Promise<API.DataChart.Produce.Response>
}

export const useProduce = create<State>((set, get) => ({
    params: {factory_id: '0'},
    data: [],
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    async getData() {
        const res = await getProduct(get().params)
        set({data: res.code === 0 ? res.data || [] : []})
        return res
    },
    clear() {
        set({params: {factory_id: '0'}, data: []})
    },
}))
