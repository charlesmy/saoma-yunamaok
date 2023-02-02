/** @format */
import create from 'zustand'
import request from '@/src/network/index'
import {API} from '@/src/types/index'

interface State {
    data: API.Home.EmployeeInfo.Data | null
    onLoad: () => Promise<API.Home.EmployeeInfo.Response>
}

export const useEmployeeInfo = create<State>(set => ({
    data: null,
    async onLoad() {
        const res = await request.post<API.Home.EmployeeInfo.Data>(`/indexApi/employeeInfo`)
        if (res.code === 0) {
            set({data: res.data})
        }
        return res
    },
}))
