/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'
import {getList} from '../api/index'

interface State {
    isPullingUp: boolean
    isPullingDown: boolean
    isDone: boolean
    isError: boolean
    list: API.Message.List.Item[]
    response: API.Message.List.Response | null
    params: API.Message.List.Params
    selectItem: API.Message.List.Item | null
    setSelectItem: (item: API.Message.List.Item | null) => void
    setParams: (params: Partial<API.Message.List.Params>) => void
    onPullDown: () => void
    onPullUp: () => void
    clear: () => void
    delItem: (id: number) => void
    updateItem: (item: API.Message.List.Item) => void
}

export const useList = create<State>((set, get) => ({
    isPullingUp: false,
    isPullingDown: false,
    isDone: false,
    isError: false,
    list: [],
    selectItem: null,
    response: null,
    params: {page: 1, limit: 20, type: 1},
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    setSelectItem(item) {
        set({selectItem: item})
    },
    async onPullDown() {
        if (get().isPullingDown) return
        set({isPullingDown: true, params: {...get().params, page: 1}, selectItem: null, list: []})
        const res = await getList(get().params)
        const isError = res.code !== 0
        if (!isError) {
            const isDone = !res?.data?.hasNext || (res?.data?.list?.length || 0) < get().params.limit
            set({
                list: res?.data?.list || [],
                response: res,
                isDone,
                isError,
                isPullingDown: false,
                params: {...get().params, page: 2},
            })
        } else {
            set({response: res, isError, isDone: false, list: [], isPullingDown: false})
        }
    },
    async onPullUp() {
        if (get().isPullingDown || get().isPullingUp || get().isDone) return
        set({isPullingUp: true, params: {...get().params, page: 1}})
        const res = await getList(get().params)
        const isError = res.code !== 0
        if (!isError) {
            const arr = res?.data?.list || []
            const list = get().list.concat(arr)
            const isDone = !res?.data?.hasNext || (res?.data?.list?.length || 0) < get().params.limit
            set({
                list,
                response: res,
                isDone,
                isError,
                isPullingUp: false,
                params: {...get().params, page: get().params.page + 1},
            })
        } else {
            set({
                isError,
                isPullingUp: false,
            })
        }
    },
    delItem(id) {
        const list = get().list.filter(item => item.id !== id)
        set({list})
    },
    updateItem(item) {
        const list = get().list.map(cur => {
            if (cur.id === item.id) {
                return {...cur, status: 2}
            }
            return cur
        })
        set({list})
    },
    clear() {
        set({
            isPullingUp: false,
            isPullingDown: false,
            isDone: false,
            isError: false,
            list: [],
            response: null,
            params: {page: 1, limit: 20, type: 1},
            selectItem: null,
        })
    },
}))
