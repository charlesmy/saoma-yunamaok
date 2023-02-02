/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'

interface Cache {
    [key: string]: API.Job.Desc.Data[]
}

interface State {
    cache: Cache
    addCache: (key: string, data: API.Job.Desc.Data[]) => void
    clear: () => void
}

export const useDesc = create<State>((set, get) => ({
    cache: {},
    addCache(key, data) {
        set({cache: {...get().cache, [key]: data}})
    },
    clear() {
        set({cache: {}})
    },
}))
