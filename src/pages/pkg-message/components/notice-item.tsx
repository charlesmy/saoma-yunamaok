/** @format */

import React from 'react'
import {View} from '@tarojs/components'
import {goRoute, Pages} from '@/src/utils/routes'
import {API} from '@/src/types/index'
import styles from './notice-item.module.scss'

interface Props {
    item: API.Message.List.Item
}

function NoticeItem(props: Props) {
    const {item} = props
    return (
        <View className={styles.item} onClick={() => goRoute(Pages.pages_pkg_message_detail, {id: item.id})}>
            <View className={styles.title}>{item.title}</View>
            <View className={styles.desc}>{item.content}</View>
            <View className={styles.date}>{item.create_time}</View>
        </View>
    )
}

export default React.memo(NoticeItem)
