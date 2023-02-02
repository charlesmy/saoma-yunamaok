/** @format */
import create from 'zustand'
import request from '@/src/network/index'
import {API} from '@/src/types/index'

interface State {
    data: API.Setting.SetupDetail.Data | null
    onLoad: () => Promise<API.Setting.SetupDetail.Response>
    setData: (data: Partial<API.Setting.SetupDetail.Data>) => void
    clear: () => void
}

export const useSetting = create<State>((set, get) => ({
    data: null,
    async onLoad() {
        const res = await request.post<API.Setting.SetupDetail.Data>(`/indexApi/setupDetail`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
    setData(data) {
        set({data: {...get().data, ...data} as API.Setting.SetupDetail.Data})
    },
    clear() {
        set({data: null})
    },
}))
