/** @format */
import {View} from '@tarojs/components'
import Tab, {TabOption} from '@/src/components/tabs/tab'
import {useEffect} from 'react'
import {useReachBottom} from '@tarojs/taro'
import {useMsgCount} from '@/src/stores/msg-count'

import styles from './index.module.scss'
import NoticeItem from './components/notice-item'
import {useList} from './stores/list'

function Index() {
    const msgCount = useMsgCount()
    const listStore = useList()

    const tabs: TabOption[] = [
        {name: '内部消息', index: 0, count: msgCount.data?.neibu || 0, value: 1},
        {name: '系统消息', index: 1, count: msgCount.data?.system || 0, value: 2},
    ]

    useEffect(() => {
        msgCount.onLoad()
        listStore.setParams({status: 2})
        listStore.onPullDown()
        return () => {
            listStore.clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useReachBottom(() => {
        if (listStore.isDone) return
        listStore.onPullUp()
    })

    const onChange = (item: TabOption) => {
        if (item.value === listStore.params.type) return
        listStore.setParams({type: item.value})
        listStore.onPullDown()
    }

    const tips =
        listStore.isPullingDown || listStore.isPullingUp
            ? '加载中'
            : listStore.isDone
            ? '没有更多了'
            : listStore.isError
            ? '出错了'
            : ''

    return (
        <View className={styles.page}>
            <Tab tabs={tabs} onChange={onChange}></Tab>
            {listStore.list.map(item => (
                <NoticeItem key={item.id} item={item} />
            ))}
            <View className={styles.tips}>{tips}</View>
        </View>
    )
}

export default Index
