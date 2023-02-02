/** @format */
// import {useEffect} from 'react'
import {useMsgCount} from '@/src/stores/msg-count'
import {useDidShow} from '@tarojs/taro'
import {useUser} from '@/src/stores/user'

import {useBanner} from './banner'
import {useEmployeeInfo} from './employee-info'

export function useInit() {
    const getUser = useUser(state => state.getUser)
    const [onBannerLoad] = useBanner(state => [state.onLoad])
    const onLoadEmployeeInfo = useEmployeeInfo(state => state.onLoad)
    const msgCount = useMsgCount(state => state.onLoad)

    // useEffect(() => {
    //     Promise.all([onBannerLoad(), onLoadEmployeeInfo(), msgCount()])
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    useDidShow(() => {
        getUser(false)
        Promise.all([onBannerLoad(), onLoadEmployeeInfo(), msgCount()])
    })
}
