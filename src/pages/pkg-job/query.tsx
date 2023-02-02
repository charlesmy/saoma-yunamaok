/** @format */

import {View} from '@tarojs/components'
import {SearchBar} from '@nutui/nutui-react-taro'
import {useEffect} from 'react'
import {useReachBottom} from '@tarojs/taro'

import styles from './query.module.scss'
import Filter from './components/filter'
import Data from './components/data'
import QueryList from './views/query-list'
import {useList} from './stores/list'
import {useDesc} from './stores/desc'

function JobQuery() {
    const listStore = useList()
    const clearDesc = useDesc(state => state.clear)

    useEffect(() => {
        return () => {
            clearDesc()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
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

    const onSearchChange = val => {
        listStore.setParams({orderNumOrName: val})
        listStore.onPullDown()
    }

    return (
        <View className={styles.page}>
            <View className={styles.fixed}>
                <SearchBar placeholder="搜索 订单号/工序" background="rgb(30, 130, 210)" onChange={onSearchChange} />
                <Filter />
                <Data />
            </View>
            <QueryList />
        </View>
    )
}

export default JobQuery
