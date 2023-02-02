/** @format */

import React from 'react'
import {View, Text} from '@tarojs/components'
import {Pages, goRoute} from '@/src/utils/routes'
import {Icon} from '@nutui/nutui-react-taro'
import {fmtTimeBucket} from '@/src/utils/date'
import {useMsgCount} from '@/src/stores/msg-count'

import styles from './notice.module.scss'
import {useBanner} from '../stores/banner'

function Notice() {
    const data = useBanner(state => state.data)
    const msgCount = useMsgCount(state => state.data)
    if (!data?.xiaoxi?.length) return null
    const list = data.xiaoxi.slice(0, 2)
    const count = (msgCount?.neibu || 0) + (msgCount?.system || 0)
    return (
        <View className={styles.notice} onClick={() => goRoute(Pages.pages_pkg_message_notice)}>
            <Icon fontClassName="iconfont-v2" classPrefix="icon" name="dalaba" size="30px" />
            <View className={styles.middle}>
                {list.map(item => (
                    <View className={styles.line} key={item.title + item.create_time}>
                        <Text className={styles.title}>{item.title}</Text>
                        <Text className={styles.time}>{fmtTimeBucket(item.create_time)}</Text>
                    </View>
                ))}
            </View>
            <View className={styles.right}>
                <View className={styles.count}>{count <= 99 ? count : '...'}</View>
            </View>
        </View>
    )
}

export default React.memo(Notice)
