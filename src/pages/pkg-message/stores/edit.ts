/** @format */
import create from 'zustand'

interface State {
    type: number //类型，1内部，2系统
    start_time: string //开始时间
    end_time: string //结束时间
    title: string //消息标题
    content: string //消息内容
    img: string //图片\\文件
    location: number //显示位置，1广告位，2消息提醒
    roles: string //执行对象，英文逗号隔开
    setValue: (state: Partial<State>) => void
    clear: () => void
}

export const useMsgEdit = create<State>(set => ({
    type: 0,
    start_time: '',
    end_time: '',
    title: '',
    content: '',
    img: '',
    location: 0,
    roles: '',
    setValue(state) {
        set({...state})
    },
    clear() {
        set({
            type: 0,
            start_time: '',
            end_time: '',
            title: '',
            content: '',
            img: '',
            location: 0,
            roles: '',
        })
    },
}))
