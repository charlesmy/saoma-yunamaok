/** @format */

import React from 'react'
import {View, Text} from '@tarojs/components'
import styles from './data.module.scss'
import {useList} from '../stores/list'

function Data() {
    const data = useList(state => state.stat)
    return (
        <View className={styles.container}>
            <View className={styles.list}>
                <View className={styles.item}>
                    <View className={styles.title}>总数量</View>
                    <View className={styles.line}>
                        <Text className={styles.jian}>{data?.today_count || 0}件</Text>|
                        <Text className={styles.za}>{data?.today_zhashu || 0}扎</Text>
                    </View>
                </View>
                <View className={styles.item}>
                    <View className={styles.title}>总金额</View>
                    <View className={styles.money}>¥{data?.today_price || 0}元</View>
                </View>
            </View>

            <View className={styles.monthSum}>
                <View>
                    <Text className={styles.title}>当月总数量</Text>
                    <Text className={styles.jian}>{data?.month_count || 0}件</Text>|
                    <Text className={styles.za}>{data?.month_zhashu || 0}扎</Text>
                </View>
                <View>
                    <Text className={styles.title}>当月总金额</Text>
                    <Text className={styles.money}>¥{data?.month_price}元</Text>
                </View>
            </View>
        </View>
    )
}

export default React.memo(Data)
