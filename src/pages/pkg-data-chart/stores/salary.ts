/** @format */
import {API} from '@/src/types/index'
import create from 'zustand'
import {getSalary} from '../api'

interface State {
    params: API.DataChart.Salary.Params
    data: API.DataChart.Salary.Data[]
    getData: () => Promise<API.DataChart.Salary.Response>
    setParams: (params: Partial<API.DataChart.Salary.Params>) => void
    clear: () => void
}

export const useSalary = create<State>((set, get) => ({
    params: {year: '', beginTime: '', endTime: '', factoryId: '', groupId: '', employee: ''},
    data: [],
    setParams(params) {
        set({params: {...get().params, ...params}})
    },
    async getData() {
        const res = await getSalary(get().params)
        set({data: res.code === 0 ? res.data || [] : []})
        return res
    },
    clear() {
        set({params: {year: '', beginTime: '', endTime: '', factoryId: '', groupId: '', employee: ''}, data: []})
    },
}))
