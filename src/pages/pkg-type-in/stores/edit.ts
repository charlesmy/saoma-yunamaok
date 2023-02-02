/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'
import {getProcessDetail} from '../api'

interface State {
    params: API.TypeIn.ProcessDetail.Params
    data: API.TypeIn.ProcessDetail.Data | null
    setParams: (params: Partial<API.TypeIn.ProcessDetail.Params>) => void
    clear: () => void
    onLoad: () => Promise<API.TypeIn.ProcessDetail.Response>
}

export const useEdit = create<State>((set, get) => ({
    params: {orderNum: '', processId: '', zhahao: ''},
    data: null,
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    async onLoad() {
        const res = await getProcessDetail(get().params)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    clear() {
        set({params: {orderNum: '', processId: '', zhahao: ''}, data: null})
    },
}))

interface InputState {
    map: {
        [key: string]: string
    }
    setMap: (id: string, val: string) => void
    clear: () => void
}
export const useInput = create<InputState>((set, get) => ({
    map: {},
    setMap(id, val) {
        set({map: {...get().map, [id]: val}})
    },
    clear() {
        set({map: {}})
    },
}))
