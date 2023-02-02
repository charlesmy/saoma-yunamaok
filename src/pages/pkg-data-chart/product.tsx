/** @format */

import {View} from '@tarojs/components'
import React, {useState} from 'react'
import Tabs from '@/src/components/tabs/tab'
import {useFactoryList} from '@/src/stores/factory-list'
import {useReady} from '@tarojs/taro'

import styles from './product.module.scss'
import Produce from './views/produce'
import Order from './views/order'
// import Quality from './views/quality'
import Salary from './views/salary'

function Product() {
    const onLoadFactoryList = useFactoryList(state => state.onLoad)

    const tabs = [
        {name: '生产数据', index: 0},
        {name: '订单数据', index: 1},
        {name: '工资数据', index: 2},
        // {name: '品质数据', index: 3},
    ]
    const [current, setCurrent] = useState(0)

    const Content = React.useMemo(() => {
        const map = {
            0: <Produce />,
            1: <Order />,
            2: <Salary />,
            // 3: <Quality />,
        }
        return map[current] || map[0]
    }, [current])

    useReady(() => {
        onLoadFactoryList()
    })

    return (
        <View className={styles.page}>
            <Tabs tabs={tabs} onChange={item => setCurrent(item.index)} defaultIndex={0} />
            {Content}
        </View>
    )
}

export default Product
