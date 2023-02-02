/** @format */

import React from 'react'
import {View} from '@tarojs/components'
import styles from './sum.module.scss'
import {useList} from '../stores/list'

function Sum() {
    const data = useList(state => state.stat)
    return (
        <View className={styles.sum}>
            {' '}
            订单：{data?.order_count || 0}单 | 下单：{data?.order_jianshu || 0}件 | 裁床：{data?.caichuang_count || 0}件
            | 车间： {data?.chejian_count || 0}件 | 尾部：{data?.tail_count || 0}件
        </View>
    )
}

export default React.memo(Sum)
