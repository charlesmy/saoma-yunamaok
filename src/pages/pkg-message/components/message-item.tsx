/** @format */

import React from 'react'
import {View, Text} from '@tarojs/components'
// import {goRoute, Pages} from '@/src/utils/routes'
import classNames from 'classnames'
import {API} from '@/src/types/index'
import styles from './message-item.module.scss'

interface Props {
    item: API.Message.List.Item
    onSelect?: (item: API.Message.List.Item) => void
    selectId?: number
}

function MessageItem(props: Props) {
    const {item} = props
    const status = {1: '未发布', 2: '已发布'}
    return (
        <View className={styles.item} onClick={() => props?.onSelect?.(props.item)}>
            <View className={styles.left}>
                <View className={classNames(styles.radio, item.id === props.selectId ? styles.radioSelect : '')}></View>
            </View>
            <View className={styles.right}>
                <View className={styles.top}>
                    <Text className={styles.title}>{item.title}</Text>
                    <Text className={styles.status}>[{status[item.status] || '-'}]</Text>
                </View>
                <View className={styles.desc}>{item.content}</View>
                <View className={styles.date}>{item.create_time}</View>
            </View>
        </View>
    )
}

export default React.memo(MessageItem)
