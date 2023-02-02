/** @format */

import {View} from '@tarojs/components'
import {SearchBar} from '@nutui/nutui-react-taro'
import {useFactoryList} from '@/src/stores/factory-list'
import {useEffect} from 'react'
import {useReachBottom} from '@tarojs/taro'

import styles from './progress.module.scss'
import Filter from './views/filter'
import Sum from './views/sum'
import ProductItem from './components/product-item'
import {useList} from './stores/list'

function Progress() {
    const loadFactory = useFactoryList(state => state.onLoad)
    const listStore = useList()

    useEffect(() => {
        loadFactory()
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
        listStore.setParams({orderNum: val})
        listStore.onPullDown()
    }

    return (
        <View className={styles.page}>
            <View className={styles.fixed}>
                <SearchBar placeholder="搜索 订单号/工序" background="rgb(30, 130, 210)" onChange={onSearchChange} />
                <Filter />
                <Sum />
            </View>
            {listStore.list.map(item => (
                <ProductItem key={item.order_id} item={item} />
            ))}
        </View>
    )
}

export default Progress
