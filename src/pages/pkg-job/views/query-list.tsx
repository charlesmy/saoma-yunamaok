/** @format */

import React from 'react'
import {View} from '@tarojs/components'
import styles from './query-list.module.scss'
import QueryListItem from '../components/query-list-item'
import {useList} from '../stores/list'

function QueryList() {
    const list = useList(state => state.list)
    return (
        <View className={styles.list}>
            {list.map(item => (
                <QueryListItem key={item.order_id + item.process_id} item={item} />
            ))}
        </View>
    )
}

export default React.memo(QueryList)
