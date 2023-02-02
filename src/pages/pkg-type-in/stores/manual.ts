/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'
import {getScanDetail} from '../api'

interface State {
    params: API.TypeIn.Detail.Params
    data: API.TypeIn.Detail.Data | null
    setParams: (params: Partial<API.TypeIn.Detail.Params>) => void
    clear: () => void
    onLoad: () => Promise<API.TypeIn.Detail.Response>
}

export const useManual = create<State>((set, get) => ({
    params: {orderNum: '', zhahao: ''},
    data: null,
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    async onLoad() {
        const res = await getScanDetail(get().params)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    clear() {
        set({params: {orderNum: '', zhahao: ''}, data: null})
    },
}))
