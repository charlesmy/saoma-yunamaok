/** @format */
import create from 'zustand'
import {API} from '@/src/types/index'
import {getList, getStat} from '../api/index'

interface State {
    isPullingUp: boolean
    isPullingDown: boolean
    isDone: boolean
    isError: boolean
    list: API.Job.Query.Item[]
    response: API.Job.Query.Response | null
    params: API.Job.Query.Params
    setParams: (params: Partial<API.Job.Query.Params>) => void
    onPullDown: () => void
    onPullUp: () => void
    clear: () => void
    stat: null | API.Job.Stat.Data
}

export const useList = create<State>((set, get) => ({
    isPullingUp: false,
    isPullingDown: false,
    isDone: false,
    isError: false,
    list: [],
    selectItem: null,
    response: null,
    params: {page: 1, limit: 20, orderNumOrName: '', jpNumberOrName: '', beginTime: '', endTime: ''},
    stat: null,
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    async onPullDown() {
        if (get().isPullingDown) return
        set({isPullingDown: true, params: {...get().params, page: 1}, list: []})
        const [res, statRes] = await Promise.all([getList(get().params), getStat(get().params)])
        const isError = res.code !== 0
        if (statRes.code === 0) {
            set({stat: statRes.data})
        }
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
    clear() {
        set({
            isPullingUp: false,
            isPullingDown: false,
            isDone: false,
            isError: false,
            list: [],
            response: null,
            params: {page: 1, limit: 20, orderNumOrName: '', jpNumberOrName: '', beginTime: '', endTime: ''},
            stat: null,
        })
    },
}))
