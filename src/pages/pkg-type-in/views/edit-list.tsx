/** @format */

import React from 'react'
import {View, Radio, Text} from '@tarojs/components'
import classNames from 'classnames'
import styles from './edit-list.module.scss'

function EditList() {
    return (
        <View className={styles.list}>
            <View className={styles.item}>
                <Radio className={styles.radio} />
                <View className={styles.content}>
                    <View className={styles.title}>
                        <Text className={styles.name}>平车</Text>
                        <View className={classNames(styles.size)}>XS</View>
                    </View>
                    <View className={styles.flag}>
                        <Text className={styles.flagItem}>数量： 20</Text>
                        <Text className={styles.flagItem}>员工：钟先生</Text>
                        <Text className={classNames(styles.flagItem, styles.date)}>2022.5.6 15:23:56</Text>
                    </View>
                </View>
            </View>

            <View className={styles.item}>
                <Radio className={styles.radio} />
                <View className={styles.content}>
                    <View className={styles.title}>
                        <Text className={styles.name}>平车</Text>
                        <View className={classNames(styles.size)}>XS</View>
                    </View>
                    <View className={styles.flag}>
                        <Text className={styles.flagItem}>数量： 20</Text>
                        <Text className={styles.flagItem}>员工：钟先生</Text>
                        <Text className={classNames(styles.flagItem, styles.date)}>2022.5.6 15:23:56</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default React.memo(EditList)
