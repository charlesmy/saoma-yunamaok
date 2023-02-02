/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'
import {getDetail} from '../api'

interface State {
    data: null | API.Product.Desc.Data
    params: API.Product.Desc.Params
    setParams: (params: Partial<API.Product.Desc.Params>) => void
    onLoad: () => Promise<API.Product.Desc.Response>
    clear: () => void
}
export const useDetail = create<State>((set, get) => ({
    data: null,
    params: {orderId: 0},
    async onLoad() {
        const res = await getDetail(get().params)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    clear() {
        set({data: null, params: {orderId: 0}})
    },
}))
